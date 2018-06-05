import config from './config';
import { waitForDOMContentLoaded, getParameterByName } from './utils/index';
import DBHelper from './data/dbhelper';
import StaticMap from './components/staticmap';
import renderBreadcrumb from './components/breadcrumb';
import renderAddress from './components/address';
import renderReviews from './components/reviews';
import renderHours from './components/hours';
import renderImage from './components/image';
import renderCopyright from './components/copyright';

export default class RestaurantInfo {

	constructor(window, document) {
		this.window = window;
		this.document = document;

		this.map = new StaticMap(
			this.document,
			() => this.document.getElementById('map'));

		this.initialize();
	}
	
	initialize = () => {

		// Render restaurant info
		this.fetchRestaurantFromURL().
			then(restaurant => this.restaurant = restaurant).
			then(() => DBHelper.getReviewsForRestaurant(this.restaurant.id)).
			then(reviews => this.restaurant.reviews = reviews || []).
			then(() => waitForDOMContentLoaded(this.document)).
			then(() => {
				renderBreadcrumb(this.document, this.document.getElementById('breadcrumb'), this.restaurant);
				this.fillRestaurantHTML();
				this.renderStaticMap();
			});

		// Render footer component
		waitForDOMContentLoaded(this.document).
			then(() => {
				this.document.getElementById('footer').innerHTML =
					renderCopyright();
			});
	}

	renderStaticMap = () => {
		if (!this.map || !this.restaurant) return;

		this.map.render(
			`Google map of ${this.restaurant.name}`, {
				center: this.restaurant.latlng,
				markers: this.restaurant.latlng
			});
	};

	/**
	 * Get current restaurant from page URL.
	 */
	fetchRestaurantFromURL = () => {
		return new Promise((resolve, reject) => {

			if (this.restaurant)
				resolve(this.restaurant);

			const id = getParameterByName('id');

			if (!id) {
				reject('No restaurant id in URL');
			} else {
				DBHelper.fetchRestaurantById(id, (error, restaurant) => {
					if (error || !restaurant)
						reject(error || 'No restaurant fetched');
					else
						resolve(restaurant);
				});
			}
		});
	};

	/**
	 * Create restaurant HTML and add it to the webpage
	 */
	fillRestaurantHTML = (restaurant = this.restaurant) => {

		// page title
		this.document.title = `${restaurant.name} - Restraurant Reviews`;

		// name
		const name = this.document.getElementById('restaurant-name');
		name.innerHTML = restaurant.name;

		// neighborhood
		const hood = this.document.getElementById('restaurant-neighborhood');
		hood.innerHTML = restaurant.neighborhood;

		// address
		const address = this.document.getElementById('restaurant-address');
		address.innerHTML = renderAddress(restaurant.address);

		// image
		const src = DBHelper.imageUrlForRestaurant(restaurant);
		const image = this.document.getElementById('restaurant-img');
		renderImage(restaurant, image, src, 'hero', DBHelper.imageUrlForRestaurant({}));

		// cuisine
		const cuisine = this.document.getElementById('restaurant-cuisine');
		cuisine.innerHTML = restaurant.cuisine_type;

		// operating hours
		if (restaurant.operating_hours) {
			renderHours(
				this.document,
				this.document.getElementById('restaurant-hours'),
				this.restaurant.operating_hours);
		}

		// reviews
		renderReviews(
			this.document, 
			this.document.getElementById('reviews-container'), 
			this.restaurant.reviews);
	};
}
