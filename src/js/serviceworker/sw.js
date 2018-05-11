// derived from: 
// https://developers.google.com/web/fundamentals/primers/service-workers/ and 
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

// import version from './version'; // TODO: add version bump to build script

const VERSION = '1.0.0';
const version = { number: VERSION };

var CACHE_NAME = `restaurant-reviews-${version.number}`;

var urlsToCache = [
	'/',
	'/index.js',
	'/restaurant.js'
];

self.addEventListener('install', (event) => {
	console.log(`INSTALL [${version.number}]`);
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME).
			then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('activate', (event) => {
	console.log(`ACTIVATE [${version.number}]`);

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
	console.log(`FETCH [${version.number}]: [${event.request.method}] [${event.request.url}]`);

	const isPassthrough =
		event.request.method === 'POST' ||
		event.request.url.includes('sockjs-node');

	event.respondWith(

		isPassthrough ? fetch(event.request) :

			caches.match(event.request).
				then(function (response) {
					// Cache hit - return response
					if (response) {
						console.info(`CACHE HIT: [${event.request.url}]`);
						return response;
					}

					console.log(`WILL FETCH FROM NETWORK: [${event.request.url}]`);

					const fetchRequest = event.request.clone();

					return fetch(fetchRequest).
						then(function (response) {
							// Check if we received a valid response
							if (!response || response.status !== 200 || response.type !== 'basic') {
								return response;
							}

							var responseToCache = response.clone();

							caches.open(CACHE_NAME)
								.then(function (cache) {
									cache.put(event.request, responseToCache);
								});

							return response;
						});
				})
	);
});