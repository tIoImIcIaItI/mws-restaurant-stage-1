import moment from 'moment-mini';
import { waitForDOMContentLoaded, getParameterByName, isTrue } from './utils/index';
import DBHelper from './data/dbhelper';
import db from './data/db';
import ReviewForm from './forms/review';
import StaticMap from './components/staticmap';
import renderBreadcrumb from './components/breadcrumb';
import renderRestaurant from './components/restaurant';
import renderReviews from './components/reviews';
import renderCopyright from './components/copyright';
import renderFavorite from './components/favorite';

export default class RestaurantInfo {

	constructor(window, document) {
		this.window = window;
		this.document = document;
		this.reviewFormVm = null;
		this.nextId = 0;

		this.map = new StaticMap(
			this.document,
			() => this.document.getElementById('map'));

		this.initialize();
	}

	getNextId = () => --this.nextId;
	
	sortReviews = (reviews) =>
		reviews.sort((x, y) => 
			moment(y.updatedAt).valueOf() - moment(x.updatedAt).valueOf());

	initializeReviewForm = (form, showBtn) => {

		this.reviewFormVm = new ReviewForm(
			this.document, this.window.alert, form);

		this.reviewFormVm.preFormSubmit = () => {
			return this.reviewFormVm.updateValidity();
		};

		this.reviewFormVm.onSubmitValid = () => {

			form.style.display = 'none';
			showBtn.style.display = 'initial';
			
			const { name, rating, comments } = 
				this.reviewFormVm.getFormData();

			const review = {
				id: this.getNextId(),
				restaurant_id: this.restaurant.id,
				name, rating: rating || 42, comments
			};
			
			this.restaurant.reviews.unshift(review);

			renderReviews(
				this.document,
				this.document.getElementById('reviews-container'),
				this.restaurant.reviews);

			db.cacheReviews(this.restaurant.reviews);

			DBHelper.addReview(review);

			// TODO: deal with offline or 400/500 submit
		};

		// this.reviewFormVm.postFormSubmit = () => {

		// };
	};

	initialize = () => {

		const document = this.document;

		// Render restaurant info
		this.fetchRestaurantFromURL().
			then(restaurant => this.restaurant = restaurant).
			then(() => DBHelper.getReviewsForRestaurant(this.restaurant.id)).
			then(reviews => this.restaurant.reviews = this.sortReviews(reviews || [])).
			then(() => waitForDOMContentLoaded(document)).
			then(() => {
				renderBreadcrumb(document, document.getElementById('breadcrumb'), this.restaurant);
				this.renderFab(document, this.restaurant);
				renderRestaurant(document, this.restaurant);
				this.renderStaticMap();
			});

		waitForDOMContentLoaded(document).
			then(() => {

				// Render footer component

				document.getElementById('footer').innerHTML =
					renderCopyright();

				// Wire up review form

				const form = document.getElementById('new-review-form');
				const showBtn = document.getElementById('btn-show-form');

				showBtn.addEventListener('click', event => {

					form.style.display = 'initial';
					showBtn.style.display = 'none';

					if (!this.reviewFormVm)
						this.initializeReviewForm(form, showBtn);
					else
						this.reviewFormVm.reset();						

					this.reviewFormVm.setInitialFocus();
				});

				document.getElementById('new-review-btn-cancel').addEventListener('click', event => {
					form.style.display = 'none';
					showBtn.style.display = 'initial';
				});

			});
	}

	setIsFavoriteRestaurant = (id, val) =>
		DBHelper.
			setIsFavoriteRestaurant(id, val).
			then(db.cacheRestaurant);

	renderFab = (document, restaurant) => {
        renderFavorite(
            document,
            document.getElementById('fab'),
            `is-favorite-${restaurant.id}`,
			isTrue(restaurant.is_favorite),
			val => val ? 
				'btn btn-fab favorite is-favorite svg-inline--fa fa-w-16' : 
				'btn btn-fab favorite is-not-favorite svg-inline--fa fa-w-16',
			isFavorite => this.setIsFavoriteRestaurant(restaurant.id, isFavorite));
	};

	renderStaticMap = () => {
		if (!this.map || !this.restaurant) return;

		this.map.render(
			`Google map of ${this.restaurant.name}`, {
				center: this.restaurant.latlng,
				markers: this.restaurant.latlng
			});
	};

	/**
	 * Get current restaurant from page URL.
	 */
	fetchRestaurantFromURL = () => {
		return new Promise((resolve, reject) => {

			if (this.restaurant)
				resolve(this.restaurant);

			const id = getParameterByName('id');

			if (!id) {
				reject('No restaurant id in URL');
			} else {
				DBHelper.fetchRestaurantById(id, (error, restaurant) => {
					if (error || !restaurant)
						reject(error || 'No restaurant fetched');
					else
						resolve(restaurant);
				});
			}
		});
	};
}
