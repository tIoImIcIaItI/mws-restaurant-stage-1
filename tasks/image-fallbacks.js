import gulp from 'gulp';
import path from 'path';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import { reload } from 'browser-sync';
import imagemin from 'gulp-imagemin';
import config from './config';

const typeConfig = config.images;

const base = path.join(config.root.src, typeConfig.dist);

const imageFallbacks = () =>
	gulp.
		src(path.join(base, typeConfig.extensions), { base: base }).
		pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).
		pipe(imagemin(
			[imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo()],
			{ verbose: true }
		)).
		pipe(gulp.dest(path.join(config.root.src, typeConfig.dist))).
		pipe(reload({ stream: true }));

gulp.task('images:fallbacks', imageFallbacks);

export default imageFallbacks;
