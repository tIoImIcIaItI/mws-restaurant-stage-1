import gulp from 'gulp';

import { scripts } from './webpack';
import { server } from './server';
import html from './html';
import images from './images';
import data from './data';

export const dev = gulp.series(server);
export const build = gulp.series(data, images, html, scripts);

export default dev;
