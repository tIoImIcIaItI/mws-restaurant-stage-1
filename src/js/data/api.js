import config from '../config';

export const writeOptions = (method, data) => ({ 
	method: method, 
	body: JSON.stringify(data),
	headers: { 'content-type': 'application/json' } }
);

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

	static addReview(){
		return `${RestaurantsApi.base}/reviews/`;
	}

	static updateReview(id){
		return `${RestaurantsApi.base}/reviews/${id}`;
	}

	static deleteReview(id){
		return `${RestaurantsApi.base}/reviews/${id}`;
	}
}

export default RestaurantsApi;
