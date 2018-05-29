import gulp from 'gulp';
import path from 'path';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import { reload } from 'browser-sync';
//import minify from 'gulp-htmlmin';
import config from './config';

const typeConfig = config.pwa;

const base = path.join(config.root.src, typeConfig.src);

const pwa = () =>
	gulp.
		src(path.join(base, typeConfig.extensions), { base: base }).
		pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).
		//pipe(minify({ collapseWhitespace: true })).
		pipe(gulp.dest(path.join(config.root.dist, typeConfig.dist))).
		pipe(reload({ stream: true }));

gulp.task('pwa', pwa);

export default pwa;
