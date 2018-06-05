import '../../styles/app.css';
import '../../styles/cards.css';
import '../../styles/restraunt-list.css';
import '../../styles/inputs.css';
import Main from '../main';
import registerServiceWorker from '../serviceworker/serviceworker';

const main = new Main(window, document);
window.updateRestaurants = main.updateRestaurants;

registerServiceWorker(navigator, window);
