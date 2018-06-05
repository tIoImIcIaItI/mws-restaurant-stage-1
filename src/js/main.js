import 'intersection-observer'; // polyfill IntersectionObserver
import { waitForDOMContentLoaded } from './utils/index';
import DBHelper from './data/dbhelper';
import db from './data/db';
import Observer from './utils/observer';
import Map from './components/map';
import { isTrue } from './utils';
import renderCopyright from './components/copyright';
import renderRestaurant from './components/restaurant-summary';

export default class Main {

	constructor(window, document) {
		this.window = window;
		this.document = document;
		this.mapInitialized = false;

		this.initialize();
	}

	createObserver = () => {

		this.callback = (entries, observer) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return;

				const image = entry.target;
				// console.log(`INTERSECTING: ${image.getAttribute('data-src')}`);

				image.src = image.dataset.src;
				image.srcset = image.dataset.srcset;
				image.sizes = image.dataset.sizes;

				observer.unobserve(image);
			});
		};

		this.observer = new Observer(this.callback, {
			threshold: 0.05
		});
	};

	newMap = () => {
		return new Map(
			this.window, this.document, {
				zoom: 12,
				center: {
					lat: 40.722216,
					lng: -73.987501
				},
				scrollwheel: false
			},
			() => this.document.getElementById('map'),
			() => (this.restaurants || []).map(restaurant => ({
				position: restaurant.latlng,
				title: restaurant.name,
				url: DBHelper.urlForRestaurant(restaurant)
			})));
	};

	/**
	 * Fetch neighborhoods and cuisines as soon as the page is loaded.
	 */
	initialize = () => {

		// Set up lazy-load images
		this.createObserver();

		// Load initial data
		this.fetchInitialData().
		then(data => {
			this.neighborhoods = data.neighborhoods;
			this.cuisines = data.cuisines;
			this.restaurants = data.restaurants;
		}).
		then(() => waitForDOMContentLoaded(this.document)).
		then(() => {
			this.fillNeighborhoodsHTML();
			this.fillCuisinesHTML();
			this.processRestaurants();
		});

		waitForDOMContentLoaded(this.document).
		then(() => {

			// Render the footer component
			this.document.getElementById('footer').innerHTML =
				renderCopyright();

			// Wire up and reset the map toggle
			this.document.getElementById('show-map').addEventListener('change', event =>
				this.onShowMapChanged(event.target.checked)
			);
			this.onShowMapChanged(false);
		});
	}

	onShowMapChanged = (showMap) => {

		// Keep checkbox in sync
		var checkBox = this.document.getElementById('show-map');
		if (checkBox && checkBox.checked != showMap)
			checkBox.checked = showMap;

		// Keep widget in sync
		this.document.getElementById('map-container').
		style.display = showMap ? 'block' : 'none';

		// Lazy-load the actual map
		if (showMap && !this.mapInitialized) {
			this.map = this.newMap();
			this.mapInitialized = true;
		}
	};

	fetchInitialData = () => {
		return new Promise((resolve, reject) => {
			DBHelper.fetchInitialData((error, data) => {
				if (error)
					reject(error);
				else
					resolve(data);
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

	processRestaurants = () => {
		this.fillRestaurantsHTML();

		if (this.map)
			this.map.addMarkersToMap();
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

				this.processRestaurants();
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
		if (this.map)
			this.map.removeAllMarkers();

		this.restaurants = restaurants;
	};

	setIsFavoriteRestaurant = (id, val) =>
		DBHelper.
			setIsFavoriteRestaurant(id, val).
			then(db.cacheRestaurant);

	/**
	 * Create all restaurants HTML and add them to the webpage.
	 */
	fillRestaurantsHTML = (restaurants = this.restaurants) => {
		const ul = document.getElementById('restaurants-list');

		var list = [
			...restaurants.filter(r => isTrue(r.is_favorite)),
			...restaurants.filter(r => !isTrue(r.is_favorite))
		];

		list.forEach(restaurant =>
			ul.append(renderRestaurant(
				this.document,
				this.observer,
				restaurant,
				(id, val) => this.setIsFavoriteRestaurant(id, val)))
		);
	};
}
