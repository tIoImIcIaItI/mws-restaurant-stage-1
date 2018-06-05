import DBHelper from '../data/dbhelper';
import renderAddress from './address';
import renderReviews from './reviews';
import renderHours from './hours';
import renderImage from './image';

/**
 * Create restaurant HTML and add it to the webpage
 */
const render = (document, restaurant) => {

    const setInnerHtml = (id, val) => 
        document.getElementById(id).innerHTML = val;

    const { 
        name, neighborhood, address, 
        cuisine_type, operating_hours, reviews 
    } = restaurant;

    // page title
    document.title = 
        `${name} - Restraurant Reviews`;

    // name
    setInnerHtml('restaurant-name', name);

    // neighborhood
    setInnerHtml('restaurant-neighborhood', neighborhood);

    // address
    setInnerHtml('restaurant-address', renderAddress(address));

    // image
    renderImage(
        restaurant, 
        document.getElementById('restaurant-img'), 
        DBHelper.imageUrlForRestaurant(restaurant), 
        'hero', 
        DBHelper.imageUrlForRestaurant({}));

    // cuisine
    setInnerHtml('restaurant-cuisine', cuisine_type);

    // operating hours
    renderHours(
        document,
        document.getElementById('restaurant-hours'),
        operating_hours);

    // reviews
    renderReviews(
        document,
        document.getElementById('reviews-container'),
        reviews);
};

export default render;
