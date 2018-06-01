import config from '../config';

export default class StaticMap {

	constructor(document, getElement) {
		this.document = document;
		this.getElement = getElement;
	}

    getSrc = (mapOptions) => {

        const options = {
            ...config.maps.static.options,
            ...mapOptions,
            key: config.maps.key
        };

        const params = Object.entries(options).reduce((a,c,i) => {
            return a + `${i > 0 ? '&' : ''}${c[0]}=${c[1]}`;
        }, ''); // TODO: url encode

        return `${config.maps.static.url}?${params}`;
    };

	render = (alt, mapOptions) => {

		const img = this.document.createElement('img');
        img.alt = alt || 'Google map';
        img.setAttribute('src', this.getSrc(mapOptions));

		this.getElement().appendChild(img);
	};
}
