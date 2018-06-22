import idb from 'idb';
import config from '../config';
import { hash, toArrayOrEmpty, partition, whereIsSomething, whereExistsIn } from './utils';

const doDbUpgrade = (upgradeDb) => {
	console.log(`Creating database: ${config.db.name} old version ${upgradeDb.oldVersion}`);
	// Note: we don't use 'break' in this switch statement,
	// the fall-through behaviour is what we want.
	switch (upgradeDb.oldVersion) {
		case 0: {
			const { name, options } = config.db.restaurants;
			console.log(`Creating object store: ${name} ${options}`);
			upgradeDb.createObjectStore(name, options);
		}
		case 1: {
			const { name, options } = config.db.reviews;
			console.log(`Creating object store: ${name} ${options}`);
			upgradeDb.createObjectStore(name, options);
		}
		case 2: {
			const { name, options } = config.db.queuedOps;
			console.log(`Creating object store: ${name} ${options}`);
			upgradeDb.createObjectStore(name, options);
		}
	}
};

const getDb = () =>
	idb.open(config.db.name, config.db.version, doDbUpgrade);

const getStore = (db, store, mode) =>
	db.transaction(store, mode).objectStore(store);

const putAll = (store, records) =>
	Promise.all(
		toArrayOrEmpty(records).
			map(record => store.put(record)));

// RESTAURANTS

const getRestaurantsStore = (db, mode = 'readonly') =>
	getStore(db, config.db.restaurants.name, mode);

const getRestaurants = (mode = 'readonly') =>
	getDb().then(db => getRestaurantsStore(db, mode));

export const Restaurants = {

	getAll: () =>
		getRestaurants().
			then(restaurants => restaurants.getAll()).
			catch(console.error),

	get: (id) =>
		getRestaurants().
			then(restaurants => restaurants.get(id)).
			catch(console.error),

	putMany: (json) =>
		getRestaurants('readwrite').
			then(restaurants => 
				putAll(restaurants, json).
				then(restaurants.complete)).
			catch(console.error)
};

// REVIEWS

const getReviewsStore = (db, mode = 'readonly') =>
	getStore(db, config.db.reviews.name, mode);

const getReviews = (mode = 'readonly') =>
	getDb().then(db => getReviewsStore(db, mode));

const getReviewsForWrite = () =>
	getReviews('readwrite');

// https://stackoverflow.com/questions/26203075/querying-an-indexeddb-compound-index-with-a-shorter-array
const reviewKeyForRestaurant = (restaurantId) => 
	IDBKeyRange.bound([restaurantId], [restaurantId, []]);

// const tryGetCachedReviews = (restaurantId) =>
// 	getDb().
// 		then(getReviews).
// 		then(reviews => reviews.get(restaurantId)).
// 		catch(console.error);

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

const uncacheReviews = (reviews, keys) =>
	Promise.all(keys.map(reviews.delete));

const keyForReview = (review) =>
	IDBKeyRange.only([review.restaurant_id, review.id]);

const getStaleReviews = (partitionedReviews) =>
	whereExistsIn(...partitionedReviews, (x,y) => x.hashCode === y.hashCode)

const reconcileCachedReviews = (reviews) =>
	reviews.
		getAll().
		then(toArrayOrEmpty).
		then(whereIsSomething).
		then(hashReviewsContent).
		then(partitionReviews).
		then(getStaleReviews).
		then(staleReviews => staleReviews.map(keyForReview)).
		then(keys => uncacheReviews(reviews, keys));

export const Reviews = {

	getAllForRestaurant: (restaurantId) =>
		getReviews().
			then(reviews => reviews.getAll(reviewKeyForRestaurant(restaurantId))).
			catch(console.error),
	
	putMany: (json) =>
		getReviewsForWrite().
			then(reviews => 
				putAll(reviews, json).
				then(() => reconcileCachedReviews(reviews)).
				then(reviews.complete)).
			catch(console.error)
};

// QUEUED OPS

const getQueuedOpsStore = (db, mode = 'readonly') =>
	getStore(db, config.db.queuedOps.name, mode);

const getQueuedOps = (mode = 'readonly') =>
	getDb().then(db => getQueuedOpsStore(db, mode));

const getQueuedOpsForWrite = () => 
	getQueuedOps('readwrite');

export const QueuedOps = {
	
	insert: (op) =>
		getQueuedOpsForWrite().
			then(ops => ops.put(op)).
			catch(console.error),

	getAll: () =>
		getQueuedOps().
			then(ops => ops.getAll()).
			catch(console.error),

	delete: (key) =>
		getQueuedOpsForWrite().
			then(ops => ops.delete(key)).
			catch(console.error)
};
