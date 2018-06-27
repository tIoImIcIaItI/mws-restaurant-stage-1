# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 3

The **Restaurant Reviews** projects incrementally convert a static webpage to a mobile-ready web application.

In **Stage Three**, a form is added to allow users to create their own reviews. 
Users are able to mark a restaurant as a favorite. 
If the app is offline, the form and favorite functions will defer updating to the remote database until a connection is established. 
Even stricter performance benchmarks are achieved.

## Starting the API server
Clone the provided [Stage 3 API server](https://github.com/udacity/mws-restaurant-stage-3).

Follow the directions provided to start the server locally.


## Building the App
In [config.js](/src/js/config.js), replace `GOOGLE_MAPS_API_KEY` with a valid Google Maps API key.

Open a command prompt (terminal) at the root folder (containing `package.json`).

Run `npm i` then `npm run build`.


## Running the App

In the `dist` folder, start up an HTTP server on port 8000 (for example) to serve up the site files on your local computer.

The web server ***MUST*** set the correct mime types, or the service worker will not be available.
Google suggests [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related) in its [PWA course](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/).

With your server running, visit the site at `localhost` on your chosen port: `http://localhost:8000`.


## Attributions

* SVG icons used under license from [Font Awesome](https://fontawesome.com)
