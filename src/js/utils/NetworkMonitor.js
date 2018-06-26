class NetworkMonitor {

	constructor(window) {
		this.window = window;
		this.navigator = window.navigator;
	}

	initialize = () => {
		this.window.addEventListener('online',  this.updateOnlineStatus);
		this.window.addEventListener('offline', this.updateOnlineStatus);
	};

	updateOnlineStatus = (event) => {
		const isOnline = this.navigator.onLine;

		// console.log(`NETWORK: ${isOnline ? 'online' : 'offline'}`);

		if (isOnline)
			this.navigator.serviceWorker.controller.
				postMessage('sync');
	};
}

export default NetworkMonitor;
