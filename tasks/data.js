import gulp from 'gulp';
import path from 'path';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import { reload } from 'browser-sync';
import config from './config';

const typeConfig = config.data;

const base = path.join(config.root.src, typeConfig.dist);

const data = () =>
	gulp.
		src(path.join(base, typeConfig.extensions), { base: base }).
		pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).
		pipe(gulp.dest(path.join(config.root.dist, typeConfig.dist))).
		pipe(reload({ stream: true }));

gulp.task('data', data);

export default data;
