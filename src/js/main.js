import DBHelper from './dbhelper';
import { addressHtml } from './address';

export default class Main {

	constructor(document) {
		this.document = document;

		// let restaurants,
		// 	neighborhoods,
		// 	cuisines;
		// var map;
		this.markers = [];

		this.initialize();
	}

	/**
	 * Fetch neighborhoods and cuisines as soon as the page is loaded.
	 */
	initialize = () => {
		this.document.addEventListener('DOMContentLoaded', (event) => {
			this.fetchNeighborhoods();
			this.fetchCuisines();
		});
	}

	/**
	 * Fetch all neighborhoods and set their HTML.
	 */
	fetchNeighborhoods = () => {
		DBHelper.fetchNeighborhoods((error, neighborhoods) => {
			if (error) { // Got an error
				console.error(error);
			} else {
				this.neighborhoods = neighborhoods;
				this.fillNeighborhoodsHTML();
			}
		});
	};

	/**
	 * Set neighborhoods HTML.
	 */
	fillNeighborhoodsHTML = (neighborhoods = this.neighborhoods) => {
		const select = document.getElementById('neighborhoods-select');
		neighborhoods.forEach(neighborhood => {
			const option = document.createElement('option');
			option.innerHTML = neighborhood;
			option.value = neighborhood;
			select.append(option);
		});
	};

	/**
	 * Fetch all cuisines and set their HTML.
	 */
	fetchCuisines = () => {
		DBHelper.fetchCuisines((error, cuisines) => {
			if (error) { // Got an error!
				console.error(error);
			} else {
				this.cuisines = cuisines;
				this.fillCuisinesHTML();
			}
		});
	};

	/**
	 * Set cuisines HTML.
	 */
	fillCuisinesHTML = (cuisines = this.cuisines) => {
		const select = document.getElementById('cuisines-select');

		cuisines.forEach(cuisine => {
			const option = document.createElement('option');
			option.innerHTML = cuisine;
			option.value = cuisine;
			select.append(option);
		});
	};

	/**
	 * Initialize Google map, called from HTML.
	 */
	initMap = () => {
		const loc = {
			lat: 40.722216,
			lng: -73.987501
		};
		this.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: loc,
			scrollwheel: false
		});
		this.updateRestaurants();
	};

	/**
	 * Update page and map for current restaurants.
	 */
	updateRestaurants = () => {
		const cSelect = document.getElementById('cuisines-select');
		const nSelect = document.getElementById('neighborhoods-select');

		const cIndex = cSelect.selectedIndex;
		const nIndex = nSelect.selectedIndex;

		const cuisine = cSelect[cIndex].value;
		const neighborhood = nSelect[nIndex].value;

		DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
			if (error) { // Got an error!
				console.error(error);
			} else {
				this.resetRestaurants(restaurants);
				this.fillRestaurantsHTML();
			}
		});
	};

	/**
	 * Clear current restaurants, their HTML and remove their map markers.
	 */
	resetRestaurants = (restaurants) => {
		// Remove all restaurants
		this.restaurants = [];
		const ul = document.getElementById('restaurants-list');
		ul.innerHTML = '';

		// Remove all map markers
		this.markers.forEach(m => m.setMap(null));
		this.markers = [];
		this.restaurants = restaurants;
	};

	/**
	 * Create all restaurants HTML and add them to the webpage.
	 */
	fillRestaurantsHTML = (restaurants = this.restaurants) => {
		const ul = document.getElementById('restaurants-list');
		restaurants.forEach(restaurant => {
			ul.append(this.createRestaurantHTML(restaurant));
		});
		this.addMarkersToMap();
	};

	/**
	 * Create restaurant HTML.
	 */
	createRestaurantHTML = (restaurant) => {
		const li = document.createElement('li');

		const article = document.createElement('article');
		li.append(article);

		const name = document.createElement('h1');
		name.innerHTML = restaurant.name;
		article.append(name);

		const info = document.createElement('div');
		info.className = 'restaurant-info';
		{
			const image = document.createElement('img');
			image.className = 'restaurant-img';
			image.src = DBHelper.imageUrlForRestaurant(restaurant);
			image.alt = restaurant.name;
			info.append(image);

			const location = document.createElement('div');
			location.className = 'restaurant-location';
			{
				const neighborhood = document.createElement('p');
				neighborhood.innerHTML = restaurant.neighborhood;
				location.append(neighborhood);

				const address = document.createElement('p');
				address.innerHTML = addressHtml(restaurant.address);
				location.append(address);
			}
			info.append(location);
		}
		article.append(info);

		const more = document.createElement('a');
		more.innerHTML = 'View Details';
		more.href = DBHelper.urlForRestaurant(restaurant);
		article.append(more);

		return li;
	};

	/**
	 * Add markers for current restaurants to the map.
	 */
	addMarkersToMap = (restaurants = this.restaurants) => {
		restaurants.forEach(restaurant => {
			// Add marker to the map
			const marker = DBHelper.mapMarkerForRestaurant(restaurant, this.map);
			google.maps.event.addListener(marker, 'click', () => {
				window.location.href = marker.url;
			});
			this.markers.push(marker);
		});
	};
}