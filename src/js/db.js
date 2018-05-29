import idb from 'idb';
import config from './config';

const doDbUpgrade = (upgradeDb) => {
	console.log(`Creating database: ${config.db.name} old version ${upgradeDb.oldVersion}`);
	// Note: we don't use 'break' in this switch statement,
	// the fall-through behaviour is what we want.
	switch (upgradeDb.oldVersion) {
		case 0:
			const { name, key } = config.db.restaurants;
			console.log(`Creating object store: ${name} [${key}]`);
			upgradeDb.createObjectStore(name, { keyPath: key });
		// case 1:
		// 	...
	}
};

const getDb = () =>
	idb.open(config.db.name, config.db.version, doDbUpgrade);

const getStore = (db, store, mode) =>
	db.transaction(store, mode).objectStore(store);

const getRestaurants = (db, mode = 'readonly') =>
	getStore(db, config.db.restaurants.name, mode);

const putAll = (store, records) =>
	(records.length ? records : [records]).
		forEach(record => store.put(record));

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
		then(restaurants => {
			putAll(restaurants, json);
			return restaurants.complete;
		}).
		catch(console.error);

export default {
	tryGetAllCachedRestaurants,
	tryGetCachedRestaurant,
	cacheRestaurant
};
