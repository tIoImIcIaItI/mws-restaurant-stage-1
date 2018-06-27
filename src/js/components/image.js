import config from '../../../tasks/config';

// const reachFor = (obj, chain) =>
// 	(chain || '').split('.').reduce((p,c) => p || p[c], obj);

const isSomething = (x) => !!x;

const setIf = (predicate, set, get) => {
	const value = get();
	if (!predicate(value)) return undefined;
	set(value);
	return value;
};

const setIfIsSomething = (set, get) =>
	setIf(isSomething, set, get);


const infoFor = (src, defaultExt) => {
	const idx = src.lastIndexOf('.');
	const base = idx >= 0 ? src.substring(0, idx) : src;
	const ext = idx >= 0 ? src.substring(idx) : `.${defaultExt}`;

	return { base, ext };
};

const srcNameFor = (base, set, ext) => 
	`${base}-${set.tag}${ext}`;

const defaultSetFor = (group) => {
	const grp = config.srcset.groups[group];
	return grp.sets.find(s => s.tag === grp.default);
};

const defaultSrcFor = (group, src, defaultExt) => {
	const { base, ext } = infoFor(src, defaultExt);
	return srcNameFor(base, defaultSetFor(group), ext);
 };

const srcsetFor = (group, src, defaultExt) => {
	const { base, ext } = infoFor(src, defaultExt);

	return config.srcset.groups[group].sets.
		map(set => `${srcNameFor(base, set, ext)} ${set.width}w`).
		join(', ');
};

const sizesFor = (group) => {
	return config.srcset.groups[group].sets.
		map(set => set.size ? `${set.size}` : null).
		filter(s => s != null).
		join(', ');
};

export const loadLazyImage = (image) => {
	const picture = image.parentElement;
	const images = picture.querySelectorAll('source, img') || [];

	images.forEach(img => {
		setIfIsSomething(value => img.src = value, () => img.dataset.src);
		setIfIsSomething(value => img.srcset = value, () => img.dataset.srcset);
		setIfIsSomething(value => img.sizes = value, () => img.dataset.sizes);
	});
};

const render = (document, alt, className, image, src, group, placeholder, observer) => {

	const picture = image.parentElement;
	const sizes = sizesFor(group);

	image = picture.removeChild(image);

	// TODO: move to config, generalize
	const src1 = document.createElement('source');
	const src2 = document.createElement('source');

	image.alt = alt;
	image.className = className;

	if (observer) {
		src1.setAttribute('data-srcset', srcsetFor(group, src, 'webp'));
		src1.setAttribute('data-sizes', sizes);
		src1.setAttribute('type', 'image/webp');

		src2.setAttribute('data-srcset', srcsetFor(group, src, 'jpg'));
		src2.setAttribute('data-sizes', sizes);
		src2.setAttribute('type', 'image/jpg');

		image.setAttribute('data-src', defaultSrcFor(group, src, 'jpg'));
		image.setAttribute('data-srcset', srcsetFor(group, src, 'jpg'));
		image.setAttribute('data-sizes', sizes);
		image.src = placeholder.src;
		
		for (const [key, value] of Object.entries(placeholder.style))
			image.style[key] = value;

		observer.observe(image);
	} else {
		src1.srcset = srcsetFor(group, src, 'webp');
		src1.sizes = sizes;

		src2.srcset = srcsetFor(group, src, 'jpg');
		src2.sizes = sizes;

		image.srcset = srcsetFor(group, src, 'jpg');
		image.sizes = sizes;
		image.src = defaultSrcFor(group, src, 'jpg');
	}

	picture.appendChild(src1);
	picture.appendChild(src2);
	picture.appendChild(image);
};

export default render;
