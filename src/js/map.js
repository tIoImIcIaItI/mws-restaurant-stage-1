import { loadScript } from './utils/index';
import config from './config';

export default class Map {

    constructor(window, document, mapOptions, getContainer, markerFactory) {
        this.window = window;
        this.document = document;
        this.mapOptions = mapOptions;
        this.getContainer = getContainer;
        this.markerFactory = markerFactory;
        this.markers = [];

        this.window.initMap = this.initMap;

        loadScript(this.document,
            `https://maps.googleapis.com/maps/api/js?key=${config.maps.key}&libraries=places&callback=initMap`,
            true);
    }

    initMap = () => {
        this.map = new this.window.google.maps.Map(
            this.getContainer(),
            this.mapOptions);

        this.addMarkersToMap();
    };

    mapMarkerFrom = (info) => (
        new this.window.google.maps.Marker({
            position: info.position,
            title: info.title,
            url: info.url,
            map: this.map,
            animation: this.window.google.maps.Animation.DROP
        })
    );

    addMarkersToMap = () => {

        if (!this.window.google || !this.map) return;

        (this.markerFactory() || []).map(this.mapMarkerFrom).forEach(marker => {

            this.window.google.maps.event.addListener(marker, 'click', () =>
                this.window.location.href = marker.url
            );

            this.markers.push(marker);
        });
    };

    removeAllMarkers = () => {
        (this.markers || []).forEach(m => 
            m.setMap(null));

        this.markers = [];
    };
}
