import idb from 'idb';
import config from '../config';

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
		(records.length ? records : [records]).
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

const cacheReviews = (json) =>
	getDb().
		then(db => getReviews(db, 'readwrite')).
		then(reviews => 
			putAll(reviews, json).
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
