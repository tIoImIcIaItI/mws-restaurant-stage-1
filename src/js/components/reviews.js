import '../utils/dom';
import renderReview from './review';

/**
 * Create all reviews HTML and add them to the webpage.
 */
const render = (document, container, restaurant, reviews) => {

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }

    const ul = document.getElementById('reviews-list');
    removeAllChildren(ul);

    reviews.forEach(review => {
        const li = document.createElement('li');
        li.appendChild(renderReview(document, restaurant, review));
        ul.appendChild(li);
    });

    container.appendChild(ul);
};

export default render;
