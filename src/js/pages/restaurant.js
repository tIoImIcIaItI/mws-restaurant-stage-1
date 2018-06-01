import '../../styles/app.css';
import '../../styles/details.css';
import config from '../config';
import RestaurantInfo from '../restaurant_info';
import registerServiceWorker from '../serviceworker/serviceworker';

var info = new RestaurantInfo(window, document);

registerServiceWorker(navigator, window);
