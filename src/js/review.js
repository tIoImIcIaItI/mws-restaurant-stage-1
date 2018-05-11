import moment from 'moment-mini';

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
		const name = document.createElement('div');
		name.className = 'review-name';
		name.innerHTML = review.name;
		article.appendChild(name);

		const date = document.createElement('div');
		date.className = 'review-date';
		date.innerHTML = reviewDateHtml(review.date);
		article.appendChild(date);

		const rating = document.createElement('div');
		rating.className = 'review-rating';
		rating.innerHTML = `Rating: ${review.rating}`;
		article.appendChild(rating);

		const comments = document.createElement('blockquote');
		comments.className = 'review-quote';
		comments.innerHTML = review.comments;
		article.appendChild(comments);
	}

	return article;
};
