const Config = {
    server: {
        host: 'localhost',
        port: 1337
    },
    cache: {
        version: '3.0.0',
        name: 'restaurant-reviews',
        urls: [
            '/',
            '/index.html',
            '/restaurant.html',
            '/index.js',
            '/restaurant.js'
        ],
        apiEndpoints: [
            'restaurants'
        ]
    },
    db: {
        version: 3,
        name: 'restaurant-reviews',
        restaurants: {
            name: 'restaurants',
            options: { keyPath: 'id' }
        },
        reviews: {
            name: 'reviews',
            options: { keyPath: ['restaurant_id', 'id'] }
        },
        queuedOps: {
            name: 'queuedOps',
            options: { keyPath: 'ts' }
        },
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
