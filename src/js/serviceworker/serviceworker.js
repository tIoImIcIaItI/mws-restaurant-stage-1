const registerServiceWorker = (navigator, window) => {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/sw.js').then(reg => {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', reg.scope);

				reg.onupdatefound = () => {
					console.info('Service worker update found');
				};

				if (reg.installing) {
					console.log('Service worker installing');
				} else if (reg.waiting) {
					console.log('Service worker installed');
				} else if (reg.active) {
					console.log('Service worker active');
				}

			}).catch(err => {
				// registration failed :(
				console.error('ServiceWorker registration failed: ', err);
			});
		});
	}
};

export default registerServiceWorker;
