import config from '../config';
import { getDb, getStore, putAll } from './db';

const getRestaurantsStore = (db, mode = 'readonly') =>
	getStore(db, config.db.restaurants.name, mode);

const getRestaurants = (mode = 'readonly') =>
	getDb().then(db => getRestaurantsStore(db, mode));

const Restaurants = {

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

export default Restaurants;
