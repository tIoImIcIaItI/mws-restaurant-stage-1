import gulp from 'gulp';
import path from 'path';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import imageResize from 'gulp-image-resize';
import rename from 'gulp-rename';
import cleanSrcset from './srcset_clean';
import config from './config';

const typeConfig = config.srcset;

const base = path.join(config.root.src, typeConfig.src);

const srcset = (done) => {

	cleanSrcset(() => { }, false).then(() => {

		config.srcset.sets.forEach(set => {

			gulp.
				src(path.join(base, typeConfig.extensions), { base: base }).
				pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).
				pipe(imageResize({
					imageMagick: true,
					width: set.width
				})).
				pipe(rename((p) => p.basename = `${p.basename}-${set.tag}`)).
				pipe(gulp.dest(path.join(config.root.src, typeConfig.dist, typeConfig.dist)));
		});

		if (done) done();
	});
};

gulp.task('srcset', srcset);

export default srcset;
