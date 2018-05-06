import DBHelper from './dbhelper';
import { addressHtml } from './address';
import { buildRestaurantImage } from './image';
import renderCopyright from './copyright';

export default class Main {

	constructor(window, document) {
		this.window = window;
		this.document = document;
		this.markers = [];

		this.initialize();
	}

	/**
	 * Fetch neighborhoods and cuisines as soon as the page is loaded.
	 */
	initialize = () => {
		this.document.addEventListener('DOMContentLoaded', (event) => {

			Promise.
				all([this.fetchNeighborhoods(), this.fetchCuisines()]).
				then(_ => this.updateRestaurants());

			this.document.getElementById('footer').innerHTML = renderCopyright();
		});
	}

	/**
	 * Initialize Google map, called from HTML.
	 */
	initMap = () => {
		const loc = {
			lat: 40.722216,
			lng: -73.987501
		};

		this.map = new this.window.google.maps.Map(this.document.getElementById('map'), {
			zoom: 12,
			center: loc,
			scrollwheel: false
		});

		this.addMarkersToMap();
	};

	/**
	 * Fetch all neighborhoods and set their HTML.
	 */
	fetchNeighborhoods = () => {
		return new Promise((resolve, reject) => {

			DBHelper.fetchNeighborhoods((error, neighborhoods) => {
				if (error) { // Got an error
					console.error(error);
					reject(error);
				} else {
					this.neighborhoods = neighborhoods;
					this.fillNeighborhoodsHTML();
					resolve(neighborhoods);
				}
			});

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
		return new Promise((resolve, reject) => {

			DBHelper.fetchCuisines((error, cuisines) => {
				if (error) { // Got an error!
					console.error(error);
					reject(error);
				} else {
					this.cuisines = cuisines;
					this.fillCuisinesHTML();
					resolve(cuisines);
				}
			});

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
	 * Update page and map for current restaurants.
	 */
	updateRestaurants = () => {
		const cSelect = this.document.getElementById('cuisines-select');
		const nSelect = this.document.getElementById('neighborhoods-select');

		if (!cSelect || !nSelect) return;

		const cIndex = cSelect.selectedIndex;
		const nIndex = nSelect.selectedIndex;

		if (!cSelect[cIndex] || !nSelect[nIndex]) return;

		const cuisine = cSelect[cIndex].value;
		const neighborhood = nSelect[nIndex].value;

		DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
			if (error) {
				console.error(error);
			} else {
				this.resetRestaurants(restaurants);
				this.fillRestaurantsHTML();
				this.addMarkersToMap();
			}
		});
	};

	/**
	 * Clear current restaurants, their HTML and remove their map markers.
	 */
	resetRestaurants = (restaurants) => {

		// Remove all restaurants
		this.restaurants = [];
		const ul = this.document.getElementById('restaurants-list');
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
	};

	/**
	 * Create restaurant HTML.
	 */
	createRestaurantHTML = (restaurant) => {
		const li = this.document.createElement('li');
		li.className = 'card card-1';

		const article = this.document.createElement('article');
		li.append(article);

		const name = this.document.createElement('h1');
		name.innerHTML = restaurant.name;
		article.append(name);

		const info = this.document.createElement('div');
		info.className = 'restaurant-info';
		{
			const image = this.document.createElement('img');
			const src = DBHelper.imageUrlForRestaurant(restaurant);
			buildRestaurantImage(restaurant, image, src, 'thumb');
			info.append(image);

			const location = this.document.createElement('div');
			location.className = 'restaurant-location';
			{
				const neighborhood = this.document.createElement('p');
				neighborhood.innerHTML = restaurant.neighborhood;
				location.append(neighborhood);

				const address = this.document.createElement('p');
				address.innerHTML = addressHtml(restaurant.address);
				location.append(address);
			}
			info.append(location);
		}
		article.append(info);

		const more = this.document.createElement('a');
		more.innerHTML = `<span aria-hidden="true">View Details</span><span class="sr-only">${restaurant.name}</span>`;
		more.href = DBHelper.urlForRestaurant(restaurant);
		article.append(more);

		return li;
	};

	/**
	 * Map marker for a restaurant.
	 */
	mapMarkerForRestaurant = (restaurant, map) => {
		const marker = new this.window.google.maps.Marker({
			position: restaurant.latlng,
			title: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant),
			map: map,
			animation: this.window.google.maps.Animation.DROP
		});
		return marker;
	}

	/**
	 * Add markers for current restaurants to the map.
	 */
	addMarkersToMap = (restaurants = this.restaurants) => {

		if (!this.window.google || !this.map) return;

		(restaurants || []).forEach(restaurant => {
			// Add marker to the map
			const marker = this.mapMarkerForRestaurant(restaurant, this.map);
			this.window.google.maps.event.addListener(marker, 'click', () => {
				this.window.location.href = marker.url;
			});
			this.markers.push(marker);
		});
	};
}
