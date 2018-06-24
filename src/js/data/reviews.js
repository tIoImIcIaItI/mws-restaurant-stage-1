import config from '../config';
import { getDb, getStore, putAll } from './db';
import { hash, toArrayOrEmpty, partition, whereIsSomething, whereExistsIn } from './utils';

const getReviewsStore = (db, mode = 'readonly') =>
	getStore(db, config.db.reviews.name, mode);

const getReviews = (mode = 'readonly') =>
	getDb().then(db => getReviewsStore(db, mode));

const getReviewsForWrite = () =>
	getReviews('readwrite');

// https://stackoverflow.com/questions/26203075/querying-an-indexeddb-compound-index-with-a-shorter-array
const reviewKeyForRestaurant = (restaurantId) => 
	IDBKeyRange.bound([restaurantId], [restaurantId, []]);

const reviewContentHash = (r) => 
	hash(`${r.restaurant_id}${r.name}${r.rating}${r.comments}`);

const hashReviewsContent = (reviews) => {
	reviews.forEach(r => 
		r.hashCode = reviewContentHash(r));
	return reviews;
};

// Partitions reviews into temporary (locally created, with negative IDs) and persisted arrays
const partitionReviews = (reviews) =>
	partition(reviews, r => r.id < 0);

const uncacheReviews = (keys) => {

	if (!keys || !keys.length > 0)
		return Promise.resolve(undefined);

	return getReviewsForWrite().
		then(reviews => 
			Promise.all(keys.map(key => reviews.delete(key))).
				then(() => reviews.complete)
		);
};

const keyForReview = (review) =>
	IDBKeyRange.only([review.restaurant_id, review.id]);

const getStaleReviews = (partitionedReviews) =>
	whereExistsIn(...partitionedReviews, (x,y) => x.hashCode === y.hashCode)

const getAll = () =>
	getReviews().
		then(reviews => reviews.getAll());

const reconcileCachedReviews = () =>
	getAll().
		then(toArrayOrEmpty).
		then(whereIsSomething).
		then(hashReviewsContent).
		then(partitionReviews).
		then(getStaleReviews).
		then(staleReviews => staleReviews.map(keyForReview)).
		then(uncacheReviews).
		catch(console.error);

const Reviews = {

	getAllForRestaurant: (restaurantId) =>
		getReviews().
			then(reviews => reviews.getAll(reviewKeyForRestaurant(restaurantId))).
			catch(console.error),
	
	putMany: (json) => 
		getReviewsForWrite().
			then(reviews => putAll(reviews, json)).
			then(() => reconcileCachedReviews()).
			catch(console.error)
};

export default Reviews;
