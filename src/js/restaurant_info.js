import config from './config';
import { waitForDOMContentLoaded, getParameterByName } from './utils/index';
import DBHelper from './dbhelper';
import StaticMap from './components/staticmap';
import renderAddress from './components/address';
import renderReview from './components/review';
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
			then(() => waitForDOMContentLoaded(this.document)).
			then(() => {
				if (this.restaurant) {
					this.fillBreadcrumb();
					this.fillRestaurantHTML();
					this.renderStaticMap();
				}
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

		this.document.title = `${restaurant.name} - Restraurant Reviews`;

		const name = this.document.getElementById('restaurant-name');
		name.innerHTML = restaurant.name;

		const hood = this.document.getElementById('restaurant-neighborhood');
		hood.innerHTML = restaurant.neighborhood;

		const address = this.document.getElementById('restaurant-address');
		address.innerHTML = renderAddress(restaurant.address);

		const src = DBHelper.imageUrlForRestaurant(restaurant);
		const image = this.document.getElementById('restaurant-img');
		renderImage(
			restaurant, image, src, 'hero', DBHelper.imageUrlForRestaurant({}));

		const cuisine = this.document.getElementById('restaurant-cuisine');
		cuisine.innerHTML = restaurant.cuisine_type;

		// fill operating hours
		if (restaurant.operating_hours) {
			renderHours(
				this.document,
				this.document.getElementById('restaurant-hours'),
				this.restaurant.operating_hours);
		}

		// fill reviews
		this.fillReviewsHTML();
	};

	/**
	 * Create all reviews HTML and add them to the webpage.
	 */
	fillReviewsHTML = (reviews = this.restaurant.reviews) => {
		const container = this.document.getElementById('reviews-container');

		if (!reviews) {
			const noReviews = this.document.createElement('p');
			noReviews.innerHTML = 'No reviews yet!';
			container.appendChild(noReviews);
			return;
		}

		const ul = this.document.getElementById('reviews-list');
		reviews.forEach(review => {
			const li = this.document.createElement('li');
			li.appendChild(renderReview(this.document, review));
			ul.appendChild(li);
		});
		container.appendChild(ul);
	};

	/**
	 * Add restaurant name to the breadcrumb navigation menu
	 */
	fillBreadcrumb = (restaurant = this.restaurant) => {
		const breadcrumb = this.document.getElementById('breadcrumb');
		const li = this.document.createElement('li');
		li.innerHTML = restaurant.name;
		breadcrumb.appendChild(li);
	};
}
