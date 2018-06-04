import config from '../config';

class RestaurantsApi {
	static get base() {
		return `http://${config.server.host}:${config.server.port}`;
	}

	static restaurants() {
		return `${RestaurantsApi.base}/restaurants`;
	}
	
	static restaurant(id) {
		return `${RestaurantsApi.base}/restaurants/${id}`;
	}
}

export default RestaurantsApi;
