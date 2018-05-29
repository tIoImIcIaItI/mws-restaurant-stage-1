import gulp from 'gulp';

import { scripts } from './webpack';
import { server } from './server';
import html from './html';
import pwa from './pwa';
import images from './images';
import icons from './icons';
import favicon from './favicon';

export const dev = gulp.series(server);
export const build = gulp.series(images, icons, favicon, html, pwa, scripts);

export default dev;
