import idb from 'idb';
import config from '../config';
import { toArrayOrEmpty } from './utils';

// Transaction lifetime
// An IDB transaction will auto-close if it doesn't have anything to do once microtasks have been processed.

const doDbUpgrade = (upgradeDb) => {
	// console.log(`Creating database: ${config.db.name} old version ${upgradeDb.oldVersion}`);
	// Note: we don't use 'break' in this switch statement,
	// the fall-through behaviour is what we want.
	switch (upgradeDb.oldVersion) {
		case 0: {
			const { name, options } = config.db.restaurants;
			// console.log(`Creating object store: ${name} ${options}`);
			upgradeDb.createObjectStore(name, options);
		}
		case 1: {
			const { name, options } = config.db.reviews;
			// console.log(`Creating object store: ${name} ${options}`);
			upgradeDb.createObjectStore(name, options);
		}
		case 2: {
			const { name, options } = config.db.queuedOps;
			// console.log(`Creating object store: ${name} ${options}`);
			upgradeDb.createObjectStore(name, options);
		}
	}
};

export const getDb = () =>
	idb.open(config.db.name, config.db.version, doDbUpgrade);

export const getStore = (db, store, mode) =>
	db.transaction(store, mode).objectStore(store);

export const putAll = (store, records) =>
	Promise.all(
		toArrayOrEmpty(records).
			map(record => store.put(record)));
