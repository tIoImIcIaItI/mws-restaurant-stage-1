// import config from '../config';
import '../../styles/app.css';
import { loadScript } from '../utils/index';
import registerServiceWorker from '../serviceworker/serviceworker';
import Main from '../main';

// Defer loading Google maps until the page is rendered
document.addEventListener('DOMContentLoaded', (event) => {

	// loadScript(document,
	// 	'https://use.fontawesome.com/releases/v5.0.11/js/all.js',
	// 	true,
	// 	'sha384-ImVoB8Er8knetgQakxuBS4G3RSkyD8IZVVQCAnmRJrDwqJFYUE4YOv+DbIofcO9C',
	// 	'anonymous');

	// window.setTimeout(() => {

	// 	// loadScript(
	// 	// 	`https://maps.googleapis.com/maps/api/js?key=${config.maps.key}&libraries=places&callback=initMap`,
	// 	// 	true);
	// },
	// 500);
});

var main = new Main(window, document);
// window.initMap = main.initMap;
window.updateRestaurants = main.updateRestaurants;

registerServiceWorker(navigator, window);
