import '../styles/app.css';
import registerServiceWorker from './serviceworker';
import Main from './main';
import RestaurantInfo from './restaurant_info';

if (window.location.pathname.includes('/restaurant.html')) {

	var info = new RestaurantInfo(window, document);
	window.initMap = info.initMap;

} else {

	var main = new Main(window, document);
	window.initMap = main.initMap;
	window.updateRestaurants = main.updateRestaurants;

}

registerServiceWorker(navigator, window);
