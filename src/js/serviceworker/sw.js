// derived from: 
// https://developers.google.com/web/fundamentals/primers/service-workers/ and 
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

import config from '../config';
import db from '../db';
import { jsonResponseFrom, idFrom } from '../utils';

const version = { number: config.cache.version };
const CACHE_NAME = `restaurant-reviews-${version.number}`;

function updateCacheFor(request) {
	return fetch(request).
		then(response => {

			if (!response || response.status !== 200)
				return response;

			return response.json().
				then(db.cacheRestaurant);
		})
}

function getAndCacheRestraunt(event) {
	return fetch(event.request).
		then(response => {

			if (!response || response.status !== 200)
				return response;

			response.clone().json().
				then(db.cacheRestaurant);

			return response;
		})
}

function tryGetFromCache(event) {
	const id = idFrom(event.request.url);

	return id ?
		db.tryGetCachedRestaurant(id) :
		db.tryGetAllCachedRestaurants();
}

function getRestaurantData(event) {
	//console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	return tryGetFromCache(event).
		then(res => {
			// try also to get data in the background, for use during next fetch
			updateCacheFor(event.request);

			return jsonResponseFrom(res);
		}).
		catch(console.error);
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
				then(cache => cache.put(request, responseToCache));

			return response;
		});
}

self.addEventListener('install', (event) => {
	//console.log(`INSTALL [${version.number}]`);

	event.waitUntil(
		caches.open(CACHE_NAME).
			then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(config.cache.urls);
			})
	);
});

self.addEventListener('activate', (event) => {
	//console.log(`ACTIVATE [${version.number}]`);

	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	//console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	const isRestrauntData =
		event.request.method === 'GET' &&
		event.request.url.includes('/restaurants');

	const isPassthrough =
		event.request.method === 'POST' ||
		event.request.url.includes('sockjs-node') ||
		event.request.url.includes('browser-sync');

	event.respondWith(

		isRestrauntData ? getRestaurantData(event) :
			isPassthrough ? fetch(event.request) :
				caches.match(event.request).
					then(response => handleCacheMatch(event.request, response))
	);
});
