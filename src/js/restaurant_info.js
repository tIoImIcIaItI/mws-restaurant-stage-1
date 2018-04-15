import DBHelper from './dbhelper';
import { addressHtml } from './address';
import { createReviewElement } from './review';
import { fillHoursHtml } from './hours';
import '../styles/details.css';

export default class RestaurantInfo {

	constructor(document) {
		this.document = document;
		// let restaurant;
		// var map;
	}
	/**
	 * Initialize Google map, called from HTML.
	 */
	initMap = () => {
		this.fetchRestaurantFromURL((error, restaurant) => {
			if (error) { // Got an error!
				console.error(error);
			} else {
				this.map = new google.maps.Map(this.document.getElementById('map'), {
					zoom: 16,
					center: restaurant.latlng,
					scrollwheel: false
				});
				this.fillBreadcrumb();
				DBHelper.mapMarkerForRestaurant(this.restaurant, this.map);
			}
		});
	};

	/**
	 * Get current restaurant from page URL.
	 */
	fetchRestaurantFromURL = (callback) => {
		if (this.restaurant) { // restaurant already fetched!
			callback(null, this.restaurant);
			return;
		}
		const id = this.getParameterByName('id');
		if (!id) { // no id found in URL
			callback('No restaurant id in URL', null);
		} else {
			DBHelper.fetchRestaurantById(id, (error, restaurant) => {
				this.restaurant = restaurant;
				if (!restaurant) {
					console.error(error);
					return;
				}
				this.fillRestaurantHTML();
				callback(null, restaurant);
			});
		}
	};

	/**
	 * Create restaurant HTML and add it to the webpage
	 */
	fillRestaurantHTML = (restaurant = this.restaurant) => {
		const name = this.document.getElementById('restaurant-name');
		name.innerHTML = restaurant.name;

		const address = this.document.getElementById('restaurant-address');
		address.innerHTML = addressHtml(restaurant.address);

		const image = this.document.getElementById('restaurant-img');
		image.className = 'restaurant-img';
		image.src = DBHelper.imageUrlForRestaurant(restaurant);
		image.alt = restaurant.name;

		const cuisine = this.document.getElementById('restaurant-cuisine');
		cuisine.innerHTML = restaurant.cuisine_type;

		// fill operating hours
		if (restaurant.operating_hours) {
			fillHoursHtml(
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
		const title = this.document.createElement('h2');
		title.innerHTML = 'Reviews';
		container.appendChild(title);

		if (!reviews) {
			const noReviews = this.document.createElement('p');
			noReviews.innerHTML = 'No reviews yet!';
			container.appendChild(noReviews);
			return;
		}

		const ul = this.document.getElementById('reviews-list');
		reviews.forEach(review => {
			const li = this.document.createElement('li');
			li.appendChild(createReviewElement(this.document, review));
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

	/**
	 * Get a parameter by name from page URL.
	 */
	getParameterByName = (name, url) => {
		if (!url)
			url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
			results = regex.exec(url);
		if (!results)
			return null;
		if (!results[2])
			return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	};
}