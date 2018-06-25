import config from '../config';

const registerServiceWorker = (navigator, window) => {
	if (!('serviceWorker' in navigator)) return;

	window.addEventListener('load', () => {
		navigator.serviceWorker.
			register('/sw.js').
			then(reg => {
				// Registration was successful
				// console.log('ServiceWorker registration successful with scope: ', reg.scope);

				// reg.onupdatefound = () => {
				// 	console.info('Service worker update found');
				// };

				// if (reg.installing) {
				// 	console.log('Service worker installing');
				// } else if (reg.waiting) {
				// 	console.log('Service worker installed');
				// } else if (reg.active) {
				// 	console.log('Service worker active');
				// }

				if (reg.active)
					reg.sync.register(
						config.opsQueue.tag);

				// navigator.serviceWorker.ready.
				// 	then(reg => reg.sync.register(config.opsQueue.tag)).
				// 	catch(console.error);
			}).
			catch(err => {
				// registration failed :(
				console.error('ServiceWorker registration failed: ', err);
			});
	});
};

export default registerServiceWorker;
