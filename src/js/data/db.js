import idb from 'idb';
import config from '../config';

// SOURCE: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
const hash = (str = '') => {
	let hash = 0;

	if (str.length === 0)
		return hash;

	for (let i = 0; i < str.length; i++) {
		const chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}

	return hash;
};

const toArrayOrEmpty = (x) => 
	Array.isArray(x) ? x : x ? [x] : [];

const whereIsSomething = (xs) => 
	xs.filter(x => !!x);

const whereExistsIn = (lhs, rhs, predicate) => 
	lhs.filter(x => 
		rhs.find(y => predicate(x, y)));

// SOURCE: http://colin-dumitru.github.io/functional-programming/javascript/tutorial/2014/12/28/functional_operations_in_es6.html
const partition = (arr, predicate) =>
	arr.reduce(
		(l, r) => ( (predicate(r) ? l[0] : l[1]).push(r),  l ),
		[[],[]] );

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

const getRestaurants = (db, mode = 'readonly') =>
	getStore(db, config.db.restaurants.name, mode);

const tryGetAllCachedRestaurants = () =>
	getDb().
		then(getRestaurants).
		then(restaurants => restaurants.getAll()).
		catch(console.error);

const tryGetCachedRestaurant = (id) =>
	getDb().
		then(getRestaurants).
		then(restaurants => restaurants.get(id)).
		catch(console.error);

const cacheRestaurant = (json) =>
	getDb().
		then(db => getRestaurants(db, 'readwrite')).
		then(restaurants => 
			putAll(restaurants, json).
			then(restaurants.complete)).
		catch(console.error);


// REVIEWS

const getReviews = (db, mode = 'readonly') =>
	getStore(db, config.db.reviews.name, mode);

// https://stackoverflow.com/questions/26203075/querying-an-indexeddb-compound-index-with-a-shorter-array
const tryGetAllCachedReviewsFor = (restaurantId) =>
	getDb().
		then(getReviews).
		then(reviews => reviews.
			getAll( IDBKeyRange.bound([restaurantId], [restaurantId, []]) )).
		catch(console.error);

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
	Promise.all(
		keys.map(key => {
			console.info(`DELETING from cache: review ${key}`);
			return reviews.delete(key);
		})
	);

const keyForReview = (review) =>
	IDBKeyRange.only([review.restaurant_id, review.id]);

const reconcileCachedReviews = (reviews) =>
	reviews.
		getAll().
		then(toArrayOrEmpty).
		then(whereIsSomething).
		then(hashReviewsContent).
		then(partitionReviews).
		then(partitionedReviews => whereExistsIn(...partitionedReviews, (x,y) => x.hashCode === y.hashCode)).
		then(staleReviews => staleReviews.map(keyForReview)).
		then(keys => uncacheReviews(reviews, keys));

const cacheReviews = (json) =>
	getDb().
		then(db => getReviews(db, 'readwrite')).
		then(reviews => 
			putAll(reviews, json).
			then(() => console.info('reconcileCachedReviews()...')).
			then(() => reconcileCachedReviews(reviews)).
			then(() => console.info('...done')).
			then(reviews.complete)).
		catch(console.error);

	
export default {
	tryGetAllCachedRestaurants,
	tryGetCachedRestaurant,
	cacheRestaurant,

	tryGetAllCachedReviewsFor,
	// tryGetCachedReviews,
	cacheReviews
};
