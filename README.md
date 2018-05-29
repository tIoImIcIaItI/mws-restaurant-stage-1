# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 2

The **Restaurant Reviews** projects incrementally convert a static webpage to a mobile-ready web application.

In **Stage Two**, the client application pulls restaurant JSON data from an API server, and provides further offline support. 
JSON responses are cached using the IndexedDB API.
Any pages and data previously accessed while connected is reachable while offline.

### Starting the API server
Clone the provided [API server](https://github.com/udacity/mws-restaurant-stage-2).

Follow the directions provided to start the server locally.


### Building the App
In [config.js](/src/js/config.js), replace `GOOGLE_MAPS_API_KEY` with a valid Google Maps API key.

Open a command prompt (terminal) at the root folder (containing `package.json`).

Run `npm i` then `npm run build`.

### Running the App

In the `dist` folder, start up an HTTP server on port 8000 (for example) to serve up the site files on your local computer.

The web server ***MUST*** set the correct mime types, or the service worker will not be available.
Google suggests [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related) in its [PWA course](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/).

With your server running, visit the site at `localhost` on your chosen port: `http://localhost:8000`.
