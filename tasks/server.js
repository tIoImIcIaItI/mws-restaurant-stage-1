import gulp from 'gulp';
import Browser from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { config as webpackConfig } from './webpack';

const browser = Browser.create();
const bundler = webpack(webpackConfig);

export function server() {

    let config = {
        server: 'src',
        middleware: [
            webpackDevMiddleware(bundler, { /* options */ }),
            webpackHotMiddleware(bundler)
        ],
    };

    browser.init(config);

    gulp.watch('src/js/*.js').on('change', () => browser.reload());
    gulp.watch('src/html/*.html').on('change', () => browser.reload());
    gulp.watch('src/styles/*.css').on('change', () => browser.reload());
}
