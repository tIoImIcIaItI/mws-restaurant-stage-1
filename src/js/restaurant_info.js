import moment from 'moment';
import DBHelper from './dbhelper';

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
		address.innerHTML = this.addressHtml(restaurant.address);

		const image = this.document.getElementById('restaurant-img');
		image.className = 'restaurant-img';
		image.src = DBHelper.imageUrlForRestaurant(restaurant);
		image.alt = restaurant.name;

		const cuisine = this.document.getElementById('restaurant-cuisine');
		cuisine.innerHTML = restaurant.cuisine_type;

		// fill operating hours
		if (restaurant.operating_hours) {
			this.fillRestaurantHoursHTML();
		}
		// fill reviews
		this.fillReviewsHTML();
	};

	/**
	 * Wrap restaurant address in semantic element and microdata.
	 */
	addressHtml = (address) => {
		// 171 E Broadway, New York, NY 10002
		var parts = (address || '').split(', ');
		const last = parts[2].split(' ');

		var [street, city] = parts;
		var [state, zip] = last;

		return (
			'<address itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">' +
			`<span itemprop="streetAddress">${street}</span>, ` +
			`<span itemprop="addressLocality">${city}</span>, ` +
			`<span itemprop="addressRegion">${state}</span> ` +
			`<span itemprop="postalCode">${zip}</span>` +
			'</address>');
	};

	/**
	 * Create restaurant operating hours HTML table and add it to the webpage.
	 */
	fillRestaurantHoursHTML = (operatingHours = this.restaurant.operating_hours) => {
		const hours = this.document.getElementById('restaurant-hours');
		for (let key in operatingHours) {
			if (operatingHours.hasOwnProperty(key)) {
				const row = this.document.createElement('tr');

				const day = this.document.createElement('td');
				day.innerHTML = key;
				row.appendChild(day);

				const time = this.document.createElement('td');
				time.innerHTML = this.hoursHtml(operatingHours[key]);
				row.appendChild(time);

				hours.appendChild(row);
			}
		}
	};

	/**
	 * Wrap times of day in <time> elements.
	 */
	hoursHtml = (operatingHours) => {
		const regex = /(\d{1,2})\:(\d\d)\s(am|pm)/g;

		return (operatingHours || '').replace(regex, (match) => {
			const date = moment(match, 'h:mm A').format('HH:mm');
			return `<time datetime="${date}">${match}</time>`;
		});
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
			ul.appendChild(this.createReviewHTML(review));
		});
		container.appendChild(ul);
	};

	/**
	 * Create review HTML and add it to the webpage.
	 */
	createReviewHTML = (review) => {
		const li = this.document.createElement('li');
		const name = this.document.createElement('p');
		name.innerHTML = review.name;
		li.appendChild(name);

		const date = this.document.createElement('p');
		date.innerHTML = this.reviewDateHtml(review.date);
		li.appendChild(date);

		const rating = this.document.createElement('p');
		rating.innerHTML = `Rating: ${review.rating}`;
		li.appendChild(rating);

		const comments = this.document.createElement('p');
		comments.innerHTML = review.comments;
		li.appendChild(comments);

		return li;
	};

	/**
	 * Wrap review dates in <time> elements.
	 */
	reviewDateHtml = (reviewDate) => {
		// October 26, 2016
		const date = moment(reviewDate, 'MMMM DD, YYYY').format('YYYY-MM-DD');
		return `<time datetime="${date}">${reviewDate}</time>`;
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