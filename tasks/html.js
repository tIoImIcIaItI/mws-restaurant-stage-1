import gulp from 'gulp';
import path from 'path';
//import fileinclude from 'gulp-file-include';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import { reload } from 'browser-sync';
import minify from 'gulp-htmlmin';
import config from './config';

const typeConfig = config.html;

const base = path.join(config.root.src, typeConfig.src);

const html = () =>
	gulp.
		src(path.join(base, typeConfig.extensions), { base: base }).
		pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).
		// pipe(fileinclude({
		// 	prefix: '@@',
		// 	basepath: path.join(
		// 		config.root.src,
		// 		typeConfig.src
		// 	),
		// })).
		pipe(minify({ collapseWhitespace: true })).
		pipe(gulp.dest(path.join(config.root.dist, typeConfig.dist))).
		pipe(reload({ stream: true }));

gulp.task('html', html);

export default html;
