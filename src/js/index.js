import '../styles/app.css';
import Main from './main';
import RestaurantInfo from './restaurant_info';

if (window.location.pathname.includes('/restaurant.html')) {

	var info = new RestaurantInfo(document);
	window.initMap = info.initMap;

} else {

	var main = new Main(document);
	window.initMap = main.initMap;
	window.updateRestaurants = main.updateRestaurants;

}
