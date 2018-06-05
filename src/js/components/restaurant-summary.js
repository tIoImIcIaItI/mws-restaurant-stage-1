import '../../styles/buttons.css';
import '../../styles/favorite.css';
import DBHelper from '../data/dbhelper';
import { isTrue } from '../utils';
import renderAddress from './address';
import renderImage from './image';

const placeholder = {
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    style: { height: '100vh' }
};

/**
 * Create restaurant HTML.
 */
const render = (document, observer, restaurant, setIsFavoriteRestaurant) => {

    const li = document.createElement('li');
    li.className = 'card card-1';

    const article = document.createElement('article');
    li.append(article);

    const info = document.createElement('section');
    info.className = 'restaurant-info'; {

        // image
        const image = document.createElement('img');
        const src = DBHelper.imageUrlForRestaurant(restaurant);
        renderImage(restaurant, image, src, 'thumb', placeholder, observer);
        info.append(image);

        const banner = document.createElement('h2'); {

            // name
            const name = document.createElement('span');
            name.innerHTML = restaurant.name;
            banner.append(name);
        }
        info.append(banner);

        const location = document.createElement('div');
        location.className = 'restaurant-location'; {

            // neighborhood
            const neighborhood = document.createElement('p');
            neighborhood.innerHTML = restaurant.neighborhood;
            location.append(neighborhood);

            // address
            const address = document.createElement('p');
            address.innerHTML = renderAddress(restaurant.address);
            location.append(address);
        }
        info.append(location);
    }
    article.append(info);

    const footer = document.createElement('footer');{
        footer.className = 'restaurant-footer';

        // details button
        const details = document.createElement('a');
        details.className = 'btn'
        details.innerHTML = `<span aria-hidden="true">Details</span><span class="sr-only"> for ${restaurant.name}</span>`;
        details.href = DBHelper.urlForRestaurant(restaurant);
        footer.append(details);

        // is favorite

        const isFav = isTrue(restaurant.is_favorite);

        const label = document.createElement('label');
        label.className = 'container';
        footer.append(label);

        const descriptor = document.createElement('span');
        descriptor.className = 'sr-only';
        descriptor.innerHTML = 'Favorite';
        descriptor.setAttribute('for', `is-favorite-${restaurant.id}`);
        label.append(descriptor);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isFav;
        checkbox.id = `is-favorite-${restaurant.id}`;
        checkbox.addEventListener('change', event => setIsFavoriteRestaurant(restaurant.id, !isFav));
        label.append(checkbox);

        const widget = document.createElement('button');
        widget.setAttribute('aria-hidden', 'true');
        widget.className = `btn btn-icon is-favorite fas fa-heart`;
        label.append(widget);

        const widget2 = document.createElement('button');
        widget2.setAttribute('aria-hidden', 'true');
        widget2.className = `btn btn-icon is-not-favorite far fa-heart`;
        label.append(widget2);
    }
    article.append(footer);

    return li;
};

export default render;
