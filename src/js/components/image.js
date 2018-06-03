import config from '../../../tasks/config';

const infoFor = (src) => {
	const idx = src.lastIndexOf('.');
	const ext = idx >= 0 ? src.substring(idx) : '.jpg';
	const base = idx >= 0 ? src.substring(0, idx) : src;

	return {
		base,
		ext
	};
};

const srcsetFor = (group, src) => {
	const { base, ext } = infoFor(src);

	return config.srcset.groups[group].
		map(set => `${base}-${set.tag}${ext} ${set.width}w`).
		join(', ');
};

const sizesFor = (group) => {
	return config.srcset.groups[group].
		map(set => set.size ? `${set.size}` : null).
		filter(s => s != null).
		join(', ');
};

const render = (restaurant, image, src, group, placeholder, observer) => {

	const srcset = srcsetFor(group, src);
	const sizes = sizesFor(group);

	image.className = 'restaurant-img';
	image.alt = restaurant.name;

	if (observer) {
		image.setAttribute('data-src', src);
		image.setAttribute('data-srcset', srcset);
		image.setAttribute('data-sizes', sizes);

		image.src = placeholder.src;
		
		for (const [key, value] of Object.entries(placeholder.style))
			image.style[key] = value;

		observer.observe(image);
	} else {
		image.src = src;
		image.srcset = srcset;
		image.sizes = sizes;
	}
};

export default render;