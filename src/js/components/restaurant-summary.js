import '../../styles/cards.css';
import DBHelper from '../data/dbhelper';
import { isTrue } from '../utils';
import renderAddress from './address';
import renderImage from './image';
import renderFavorite from './favorite';

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
        const picture = document.createElement('picture'); {
            info.append(picture);
            
            const image = document.createElement('img');
            const src = DBHelper.imageUrlForRestaurant(restaurant);
            picture.append(image);
            renderImage(
                document,
                restaurant.name,
                'restaurant-img',
                image,
                src,
                'thumb',
                placeholder,
                observer);
        }

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
        details.innerHTML = `Details<span class="sr-only"> for ${restaurant.name}</span>`;
        details.href = DBHelper.urlForRestaurant(restaurant);
        footer.append(details);

        // favorite checkbox
        renderFavorite(
            document,
            footer,
            `is-favorite-${restaurant.id}`,
            isTrue(restaurant.is_favorite),
            val => val ? 
                'btn btn-icon favorite is-favorite svg-inline--fa fa-w-16' : 
                'btn btn-icon favorite is-not-favorite svg-inline--fa fa-w-16',
            isFavorite => setIsFavoriteRestaurant(restaurant.id, isFavorite));
    }
    article.append(footer);

    return li;
};

export default render;
