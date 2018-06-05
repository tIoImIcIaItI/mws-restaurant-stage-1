import renderReview from './review';

/**
 * Create all reviews HTML and add them to the webpage.
 */
const render = (document, container, reviews) => {

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }

    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        const li = document.createElement('li');
        li.appendChild(renderReview(document, review));
        ul.appendChild(li);
    });
    container.appendChild(ul);
};

export default render;
