# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

The **Restaurant Reviews** projects incrementally convert a static webpage to a mobile-ready web application.

In **Stage One**, a static design that lacks accessibility is converted to be responsive on different sized displays and accessible for screen reader use.
It also adds a service worker to begin the process of creating a seamless offline experience for  users.

### Building
Open a command prompt (terminal) at the root folder (containing `package.json`).

Run `npm i` then `npm run build`.

### Running

In the `dist` folder, start up an HTTP server on port 8000 (for example) to serve up the site files on your local computer.

The web server ***MUST*** set the correct mime types, or the service worker will not be available.
Google suggests [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related) in its [PWA course](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/).

With your server running, visit the site at `localhost` on your chosen port: `http://localhost:8000`.
