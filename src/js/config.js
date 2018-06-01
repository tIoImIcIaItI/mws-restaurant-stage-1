const Config = {
    server: {
        host: 'localhost',
        port: 1337
    },
    cache: {
        version: '1.0.0',
        name: 'restaurant-reviews',
        urls: [
            '/',
            '/index.js',
            '/restaurant.js'
        ]
    },
    db: {
        version: 1,
        name: 'restaurant-reviews',
        restaurants: {
            name: 'restaurants',
            key: 'id'
        }
    },
    maps: {
        key: 'GOOGLE_MAPS_API_KEY',
        static: {
            url: 'https://maps.googleapis.com/maps/api/staticmap',
            options: {
                zoom: 16,
                maptype: 'roadmap',
                size: '290x290'
            }
        }
    }
};

export default Config;
