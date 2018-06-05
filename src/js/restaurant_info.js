import config from './config';
import { waitForDOMContentLoaded, getParameterByName } from './utils/index';
import DBHelper from './data/dbhelper';
import StaticMap from './components/staticmap';
import renderBreadcrumb from './components/breadcrumb';
import renderRestaurant from './components/restaurant';
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

		const document = this.document;

		// Render restaurant info
		this.fetchRestaurantFromURL().
			then(restaurant => this.restaurant = restaurant).
			then(() => DBHelper.getReviewsForRestaurant(this.restaurant.id)).
			then(reviews => this.restaurant.reviews = reviews || []).
			then(() => waitForDOMContentLoaded(document)).
			then(() => {
				renderBreadcrumb(document, document.getElementById('breadcrumb'), this.restaurant);
				renderRestaurant(document, this.restaurant);
				this.renderStaticMap();
			});

		// Render footer component
		waitForDOMContentLoaded(document).
			then(() => {
				document.getElementById('footer').innerHTML =
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
}
