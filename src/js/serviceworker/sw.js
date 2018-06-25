// Service Worker callbacks derived from: 
// https://developers.google.com/web/fundamentals/primers/service-workers/ and 
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

import config from '../config';
import Restaurants from '../data/restaurants';
import Reviews from '../data/reviews';
import QueuedOps from '../data/queued-ops';
import DBHelper from '../data/dbhelper';
import api from '../data/api';
import { jsonResponseFrom, getParameterByName } from '../utils';

const version = { number: config.cache.version };
const CACHE_NAME = `restaurant-reviews-${version.number}`;

// RESTAURANTS

const idFrom = (url) => {
	const regex = /\/restaurants\/(\d+)/i;

	const id = (url || '').match(regex);

	return id && id.length >= 2 && id[1] ?
		parseInt(id[1], 10) :
		null;
};

function updateCacheFor(request) {
	return fetch(request).
		then(response => {

			if (!response || response.status !== 200)
				return response;

			return response.json().
				then(Restaurants.putMany);
		});
}

function getAndCacheRestraunt(event) {
	return fetch(event.request).
		then(response => {

			if (!response || response.status !== 200)
				return response;

			response.clone().json().
				then(Restaurants.putMany);

			return response;
		});
}

function tryGetFromCache(url) {

	const id = idFrom(url);

	return id ?
		Restaurants.get(id) :
		Restaurants.getAll();
}

function getRestaurantData(event) {
	//console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	return tryGetFromCache(event.request.url).
		then(res => {

			// If no data, assume we haven't fetched it yet
			if (!res || (!res.length && !res.id))
				return getAndCacheRestraunt(event);

			// Try also to get updated data in the background, for use during next fetch
			updateCacheFor(event.request);

			return jsonResponseFrom(res);
		});
}

// REVIEWS

const restaurantIdFromReviews = (url) => {
	var id = getParameterByName('restaurant_id', url);

	return id ? parseInt(id, 10) : null;
};

// const reviewIdFrom = (url) => {
// 	const regex = /\/reviews\/(\d+)$/i;

// 	const id = (url || '').match(regex);

// 	return id && id.length >= 2 && id[1] ?
// 		parseInt(id[1], 10) :
// 		null;
// };

function updateCacheForReviews(request) {
	return fetch(request).
		then(response => {

			if (!response || response.status !== 200)
				return response;

			return response.json().
				then(Reviews.putMany);
		});
}

function getAndCacheReviews(event) {
	return fetch(event.request).
		then(response => {

			if (!response || response.status !== 200)
				return response;

			response.clone().json().
				then(Reviews.putMany);

			return response;
		})
}

function tryGetReviewFromCache(url) {

	const restaurantId = restaurantIdFromReviews(url);
	// const id = reviewIdFrom(url);

	// return //id ?
		//Reviews.tryGetCachedReview(id) :
		return Reviews.getAllForRestaurant(restaurantId);
}

function getReviewData(event) {
	//console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	return tryGetReviewFromCache(event.request.url).
		then(res => {

			// If no data, assume we haven't fetched it yet
			if (!res || (!res.length && !res.id))
				return getAndCacheReviews(event);

			// Try also to get updated data in the background, for use during next fetch
			updateCacheForReviews(event.request);

			return jsonResponseFrom(res);
		});
}


function handleCacheMatch(request, response) {

	// Cache hit - return response
	if (response) {
		//console.info(`CACHE HIT: [${request.url}]`);
		return response;
	}

	// console.log(`WILL FETCH FROM NETWORK: [${request.url}]`);

	const fetchRequest = request.clone();

	return fetch(fetchRequest).
		then(response => {

			if (!response || response.status !== 200 || response.type !== 'basic')
				return response;

			var responseToCache = response.clone();

			caches.open(CACHE_NAME).
				then(cache => cache.put(request, responseToCache)).
				catch(console.error);

			return response;
		});
}

const parseIsFavorite = (url) => {
	const regex = /is_favorite\=(true|false)$/i;

	const val = (url || '').match(regex);

	return val && val.length >= 2 && val[1] ?
		val[1] :
		null;
};

function putIsFavorite(event) {

	const url = event.request.url;
	const id = idFrom(url);
	const isFavorite = parseIsFavorite(url);

	// Update the local cache
	Restaurants.favorite(id, isFavorite);

	return fetch(event.request).
		then(response => {
			if (!response || (![200, 201, 204].includes(response.status) && (response.status < 400 || response.status >= 500)))
				throw new Error(response ? response.status.status : 'No response from server');
			return response;
		}).
		catch(error =>
			QueuedOps.
				insert({
					ts: Date.now(),
					op: 'favorite',
					args: JSON.stringify([id, isFavorite])
				}).
				then(() => registerForSync()).
				then(() => new Response(JSON.stringify(isFavorite), {
					"status": 202,
					"statusText": "ACCEPTED"}))
		).
		catch(console.error);
}

function handlePostReview(event) {

	const asLocalReview = (review, now) => {
		review.id = -now;
		review.createdAt = now;
		review.updatedAt = now;
		return review;
	};

	const now = Date.now();

	// Cache the review
	event.request.clone().json().
		then(review => asLocalReview(review, now)).
		then(Reviews.putMany).
		catch(console.error);

	// console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	const request = event.request.clone();

	return fetch(event.request).
		then(response => {
			// If we got a 201, that means we POSTed the review so pass the successful response on.
			// If we got a 400 response, pass it on as this is a client/data error that is unlikely to be transient.
			// For any other failure to POST, queue up a retry.
			if (!response || (response.status !== 201 && (response.status < 400 || response.status >= 500)))
				throw new Error(response ? response.status.status : 'No response from server');
			return response;
		}).
		catch(error => {
			return request.json().
				then(body => asLocalReview(body, now)).
				then(review => QueuedOps.
					insert({
						ts: Date.now(),
						op: 'addReview',
						args: JSON.stringify([review])
					}).
					then(() => registerForSync()).
					then(() => new Response(JSON.stringify(review), {
						"status": 202,
						"statusText": "ACCEPTED"}))
				);
		}).
		catch(console.error);
}

const Ops = {
	addReview: DBHelper.addReview,
	favorite: DBHelper.setIsFavoriteRestaurant
}

const sortByTimestampDescending = (ops) => 
	ops.sort((x,y) => y.ts - x.ts);

const parseOps = (ops) => 
	ops.map(entry => ({
		...entry,
		args: JSON.parse(entry.args)
	}));

const processQueuedOps = () =>
	QueuedOps.
		getAll().
		then(sortByTimestampDescending).
		then(parseOps).
		then(ops => Promise.all(
			ops.map(entry => 
				Ops[entry.op](...entry.args).
					then(() => QueuedOps.delete(entry.ts)))
		)).
		catch(console.error);

const registerForSync = (reg = self.registration) =>
	reg.sync.
		register('queued-ops').
		catch(console.error);


// SERVICE WORKER CALLBACKS

self.addEventListener('install', (event) => {
	//console.log(`INSTALL [${version.number}]`);

	event.waitUntil(
		caches.open(CACHE_NAME).
			then(cache =>
				cache.addAll(config.cache.urls)).
			then(() => Promise.all(
				config.cache.apiEndpoints.
					map(ep => api[ep]()).
					map(url => new Request(url)).
					map(updateCacheFor))
			));
});

self.addEventListener('activate', (event) => {
	//console.log(`ACTIVATE [${version.number}]`);

	event.waitUntil(
		caches.keys().then(cacheNames => 
			Promise.all(
				cacheNames.
					filter(cacheName => cacheName !== CACHE_NAME).
					map(cacheName => 
						caches.delete(cacheName)))));
});

self.addEventListener('fetch', (event) => {
	// console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	const isFavoritePut =
		event.request.method === 'PUT' &&
		event.request.url.includes('is_favorite=');

	const isRestrauntData =
		event.request.method === 'GET' &&
		event.request.url.includes('/restaurants');

	const isReviewData =
		event.request.method === 'GET' &&
		event.request.url.includes('/reviews');

	const isReviewPost =
		event.request.method === 'POST' &&
		event.request.url.includes('/reviews');

	const isPassthrough =
		event.request.url.includes('sockjs-node') ||
		event.request.url.includes('browser-sync');

	event.respondWith(
		isFavoritePut ? putIsFavorite(event) :
		isRestrauntData ? getRestaurantData(event) :
		isReviewData ? getReviewData(event) :
		isReviewPost ? handlePostReview(event) :
		isPassthrough ? fetch(event.request) :
			caches.match(event.request, { ignoreSearch: true }).
				then(response => handleCacheMatch(event.request, response)).
				catch(console.error)
	);
});

self.addEventListener('sync', (event) => {
	if (event.tag == 'queued-ops') {
	  	return event.waitUntil(
		  processQueuedOps());
	}
});
