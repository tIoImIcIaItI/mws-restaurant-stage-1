import config from '../../tasks/config';

export const buildRestaurantImage = (restaurant, image, src, group) => {

	const base = src.replace('.jpg', '');

	const srcset =
		config.srcset.groups[group].
			map(set => `${base}-${set.tag}.jpg ${set.width}w`).
			join(', ');

	const sizes =
		config.srcset.groups[group].
			map(set => set.size ? `${set.size}` : null).
			filter(s => s != null).
			join(', ');

	image.className = 'restaurant-img';
	image.src = src;
	image.srcset = srcset;
	image.sizes = sizes;
	image.alt = restaurant.name;
};
