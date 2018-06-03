import 'intersection-observer'; // polyfill IntersectionObserver
import { waitForDOMContentLoaded } from './utils/index';
import DBHelper from './data/dbhelper';
import Observer from './utils/observer';
import Map from './components/map';
import renderAddress from './components/address';
import renderImage from './components/image';
import renderCopyright from './components/copyright';

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

	/**
	 * Create all restaurants HTML and add them to the webpage.
	 */
	fillRestaurantsHTML = (restaurants = this.restaurants) => {
		const ul = document.getElementById('restaurants-list');

		restaurants.forEach(restaurant => 
			ul.append(this.createRestaurantHTML(restaurant))
		);
	};

	/**
	 * Create restaurant HTML.
	 */
	createRestaurantHTML = (restaurant) => {
		const li = this.document.createElement('li');
		li.className = 'card card-1';

		const article = this.document.createElement('article');
		li.append(article);

		const name = this.document.createElement('h2');
		name.innerHTML = restaurant.name;
		article.append(name);

		const info = this.document.createElement('div');
		info.className = 'restaurant-info'; {

			const image = this.document.createElement('img');
			const src = DBHelper.imageUrlForRestaurant(restaurant);
			renderImage(
				restaurant, image, src, 'thumb', 
				{ 
					src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 
					style: { 
						//width: '10em',
						height: '100vh' 
					}
				}, 
				this.observer);
			info.append(image);

			const location = this.document.createElement('div');
			location.className = 'restaurant-location'; {
				const neighborhood = this.document.createElement('p');
				neighborhood.innerHTML = restaurant.neighborhood;
				location.append(neighborhood);

				const address = this.document.createElement('p');
				address.innerHTML = renderAddress(restaurant.address);
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
}
