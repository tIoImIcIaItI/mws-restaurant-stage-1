import gulp from 'gulp';
import all from 'gulp-all';
import path from 'path';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import imageResize from 'gulp-image-resize';
import rename from 'gulp-rename';
import config from './config';

const typeConfig = config.srcset;
const base = path.join(config.root.src, typeConfig.src);
const groups = config.srcset.groups;
const groupKeys = Object.keys(groups);

const srcset = () =>
	all(groupKeys.map(k => 
		all(groups[k].sets.map(set =>
				gulp.
					src(path.join(base, typeConfig.extensions), { base: base }).
					pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).
					pipe(imageResize({ imageMagick: true, width: set.width })).
					pipe(rename((p) => p.basename = `${p.basename}-${set.tag}`)).
					pipe(gulp.dest(path.join(config.root.src, typeConfig.dist, typeConfig.dist)))
			))
	));

gulp.task('srcset', srcset);

export default srcset;
