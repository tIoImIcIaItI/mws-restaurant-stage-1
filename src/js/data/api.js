import config from '../config';

class RestaurantsApi {
	static get base() {
		return `http://${config.server.host}:${config.server.port}`;
	}

	// RESTAURANTS

	static restaurants() {
		return `${RestaurantsApi.base}/restaurants`;
	}
	
	static restaurant(id) {
		return `${RestaurantsApi.base}/restaurants/${id}`;
	}

	static favorite(id, isFavorite) {
		return `${RestaurantsApi.base}/restaurants/${id}/?is_favorite=${isFavorite ? 'true' : 'false'}`;
	}

	// REVIEWS
	
	static reviewsForRestaurant(id){
		return `${RestaurantsApi.base}/reviews/?restaurant_id=${id}`;
	}

}

export default RestaurantsApi;
