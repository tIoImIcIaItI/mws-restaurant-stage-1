import moment from 'moment';

/**
 * Wrap review dates in <time> elements.
 */
const reviewDateHtml = (reviewDate) => {
	// October 26, 2016
	const date = moment(reviewDate, 'MMMM DD, YYYY').format('YYYY-MM-DD');
	return `<time datetime="${date}">${reviewDate}</time>`;
};

/**
 * Create review HTML and add it to the webpage.
 */
export const createReviewElement = (document, review) => {
	const article = document.createElement('article');
	{
		const name = document.createElement('p');
		name.innerHTML = review.name;
		article.appendChild(name);

		const date = document.createElement('p');
		date.innerHTML = reviewDateHtml(review.date);
		article.appendChild(date);

		const rating = document.createElement('p');
		rating.innerHTML = `Rating: ${review.rating}`;
		article.appendChild(rating);

		const comments = document.createElement('p');
		comments.innerHTML = review.comments;
		article.appendChild(comments);
	}

	return article;
};
