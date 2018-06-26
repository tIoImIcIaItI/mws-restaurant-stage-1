import moment from 'moment-mini';
import '../../styles/cards.css';
import '../../styles/reviews.css';

// SOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
const sequence = (length) => 
	Array.from({length}, (_, i) => i);

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
		article.className = 'review-container card';

		// HEADER
		const header = document.createElement('div'); {
			header.className = 'review-header';

			const info = document.createElement('div'); {
				// name
				const name = document.createElement('div');
				name.className = 'review-name';
				name.innerHTML = review.name;
				info.appendChild(name);

				// date
				const date = document.createElement('div');
				date.className = 'review-date';
				date.innerHTML = reviewDateHtml(review.updatedAt);
				info.appendChild(date);
			}
			header.appendChild(info);

			// rating
			const rating = document.createElement('div');
			const stars = sequence(review.rating).reduce((p, _) => p + '★&nbsp;', '');
			rating.className = 'review-rating';
			rating.innerHTML = `<span aria-hidden="true">${stars}</span><span class="sr-only">Rating: ${review.rating} of 5 stars</span>`;
			header.appendChild(rating);
		}
		article.appendChild(header);

		// comments
		const comments = document.createElement('blockquote');
		comments.className = 'review-quote';
		comments.innerHTML = review.comments;
		article.appendChild(comments);
	}

	return article;
};

export default render;
