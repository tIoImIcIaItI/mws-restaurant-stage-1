import moment from 'moment-mini';

/**
 * Wrap review dates in <time> elements.
 */
const reviewDateHtml = (reviewDate) => {
	const date = moment(reviewDate);

	return `<time datetime="${date.format('YYYY-MM-DD')}">${date.fromNow()}</time>`;
};

/**
 * Create review HTML and add it to the webpage.
 */
const render = (document, review) => {
	const article = document.createElement('article');
	{
		// name
		const name = document.createElement('div');
		name.className = 'review-name';
		name.innerHTML = review.name;
		article.appendChild(name);

		// date
		const date = document.createElement('div');
		date.className = 'review-date';
		date.innerHTML = reviewDateHtml(review.updatedAt);
		article.appendChild(date);

		// rating
		const rating = document.createElement('div');
		rating.className = 'review-rating';
		rating.innerHTML = `Rating: ${review.rating}`;
		article.appendChild(rating);

		// comments
		const comments = document.createElement('blockquote');
		comments.className = 'review-quote';
		comments.innerHTML = review.comments;
		article.appendChild(comments);
	}

	return article;
};

export default render;
