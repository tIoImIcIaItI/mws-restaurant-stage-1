import '../../styles/app.css';
import '../../styles/breadcrumb.css';
import '../../styles/details.css';
import RestaurantInfo from '../restaurant_info';
import registerServiceWorker from '../serviceworker/serviceworker';

const info = new RestaurantInfo(window, document);

registerServiceWorker(navigator, window);
