import config from './config';
import Cache from './cache';

/**
 * Common database helper functions.
 */
export default class DBHelper {

	static _cache = new Cache(1000 * 2);

	/**
	 * Database URL.
	 */
	static get DATABASE_URL() {
		return `http://${config.server.host}:${config.server.port}`;
	}

	/**
	 * Fetch all restaurants.
	 */
	static fetchRestaurants(callback) {

		// This will minimize a rapid sequence of identical API calls before the service worker cache kicks in
		const res = DBHelper._cache.tryGetByKey('all');
		if (res) {
			callback(null, res);
			return;
		}

		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${DBHelper.DATABASE_URL}/restaurants`);
		xhr.onload = () => {
			if (xhr.status === 200) {
				const restaurants = JSON.parse(xhr.responseText);
				DBHelper._cache.add('all', restaurants);
				callback(null, restaurants);
			} else {
				const error = (`Request failed. Returned status of ${xhr.status}`);
				callback(error, null);
			}
		};
		xhr.send();
	}

	/**
	 * Fetch a restaurant by its ID.
	 */
	static fetchRestaurantById(id, callback) {

		// This will minimize a rapid sequence of identical API calls before the service worker cache kicks in
		const res = DBHelper._cache.tryGetByKey(id);
		if (res) {
			callback(null, res);
			return;
		}

		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${DBHelper.DATABASE_URL}/restaurants/${id}`);
		xhr.onload = () => {
			if (xhr.status === 200) {
				const restaurant = JSON.parse(xhr.responseText);
				DBHelper._cache.add(id, restaurant);
				callback(null, restaurant);
			} else if (xhr.status === 404) {
				callback(`Restaurant with ID ${id} not found`, null);
			} else {
				const error = (`Request failed. Returned status of ${xhr.status}`);
				callback(error, null);
			}
		};
		xhr.send();
	}

	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given cuisine type
				const results = restaurants.filter(r => r.cuisine_type === cuisine);
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given neighborhood
				const results = restaurants.filter(r => r.neighborhood === neighborhood);
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				let results = restaurants;
				if (cuisine !== 'all') { // filter by cuisine
					results = results.filter(r => r.cuisine_type === cuisine);
				}
				if (neighborhood !== 'all') { // filter by neighborhood
					results = results.filter(r => r.neighborhood === neighborhood);
				}
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch all neighborhoods with proper error handling.
	 */
	static fetchNeighborhoods(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all neighborhoods from all restaurants
				const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
				// Remove duplicates from neighborhoods
				const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
				callback(null, uniqueNeighborhoods);
			}
		});
	}

	/**
	 * Fetch all cuisines with proper error handling.
	 */
	static fetchCuisines(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all cuisines from all restaurants
				const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
				// Remove duplicates from cuisines
				const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
				callback(null, uniqueCuisines);
			}
		});
	}

	/**
	 * Restaurant page URL.
	 */
	static urlForRestaurant(restaurant) {
		return (`./restaurant.html?id=${restaurant.id}`);
	}

	/**
	 * Restaurant image URL.
	 */
	static imageUrlForRestaurant(restaurant) {
		return (`/img/${restaurant.photograph || restaurant.id || 'missing.png'}`);
	}
}
