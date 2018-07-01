import gulp from 'gulp';
import { scripts } from './webpack';
import { server } from './server';
import html from './html';
import pwa from './pwa';
import clean from './srcset_clean';
import srcset from './srcset';
import images from './images';
import fallbacks from './image-fallbacks';
import copy from './images-copy'; import icons from './icons';
import favicon from './favicon';

export const dev = gulp.series(
	server);

export const build = gulp.series(
	clean, srcset, fallbacks, images, copy,
	icons, favicon,
	html, pwa, scripts);

export default dev;
