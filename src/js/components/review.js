import moment from 'moment-mini';
import '../../styles/cards.css';
import '../../styles/reviews.css';

// SOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
const sequence = (length) => 
	Array.from({length}, (_, i) => i);

const reviewDateHtml = (date) =>
	`<time datetime="${date.format('YYYY-MM-DD')}">${date.fromNow()}</time>`;

const datePublished = (date) => {
	const ymd = date.format('YYYY-MM-DD');

	return `<div aria-hidden="true" hidden><meta itemprop="datePublished" content="${ymd}">${ymd}</div>`;
};

const itemReviewed = (item) => {
	return (
`<div hidden aria-hidden="true" itemprop="itemReviewed" itemscope itemtype="http://schema.org/Thing">
	<span itemprop="name">${item}</span>
</div>`);
};

const renderRatingElement = (document, min, value, max) => {

	const stars = sequence(value).reduce((p, _) => p + '★&nbsp;', '');

	const rating = document.createElement('div');
	rating.setAttribute('itemprop', 'reviewRating');
	rating.setAttribute('itemscope', '');
	rating.setAttribute('itemtype', 'http://schema.org/Rating');
	rating.className = 'review-rating';
	rating.innerHTML = 
`<span aria-hidden="true">${stars}</span>
<div class="sr-only">
	<meta itemprop="worstRating" content = "${min}">
	<span >Rating: </span>
	<span itemprop="ratingValue">${value}</span> of 
	<span itemprop="bestRating">${max}</span>stars
</div>`;
	return rating;
};

/**
 * Create review HTML and add it to the webpage.
 */
const render = (document, restaurant, review) => {
	const article = document.createElement('article');
	{
		article.className = 'review-container card';
		article.setAttribute('itemscope', '');
		article.setAttribute('itemtype', 'http://schema.org/Review');

		// HEADER
		const header = document.createElement('div'); {
			header.className = 'review-header';

			const info = document.createElement('div'); {

				// item reviewed
				const item = document.createElement('div');
				item.innerHTML = itemReviewed(restaurant.name);
				info.appendChild(item);

				// name
				const name = document.createElement('div');
				name.setAttribute('itemprop', 'author');
				name.setAttribute('itemscope', '');
				name.setAttribute('itemtype', 'http://schema.org/Person');
				name.className = 'review-name';
				name.innerHTML = `<span itemprop="name">${review.name}</span>`;
				info.appendChild(name);

				// date
				const date = document.createElement('div');
				const createdAt = moment(review.createdAt);
				const updatedAt = moment(review.updatedAt);
				date.className = 'review-date';
				date.innerHTML = `<div>${datePublished(createdAt)}${reviewDateHtml(updatedAt)}</div>`;
				info.appendChild(date);
			}
			header.appendChild(info);

			// rating widget
			header.appendChild(
				renderRatingElement(
					document, 1, review.rating, 5));
		}
		article.appendChild(header);

		// comments
		const comments = document.createElement('blockquote');
		comments.setAttribute('itemprop', 'reviewBody');
		comments.className = 'review-quote';
		comments.innerHTML = review.comments;
		article.appendChild(comments);
	}

	return article;
};

export default render;
