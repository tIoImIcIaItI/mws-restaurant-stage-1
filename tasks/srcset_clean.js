import gulp from 'gulp';
import path from 'path';
import del from 'del';
import config from './config';

const typeConfig = config.srcset;
const base = path.join(config.root.src, typeConfig.dist);
const pattern = path.join(base, typeConfig.extensions);

const cleanSrcset = (done, dryRun) =>
	del([pattern], { dryRun: dryRun }).
		then(paths => !dryRun || 
			console.warn('Files and folders that would be deleted:\n', paths.join('\n')));

gulp.task('clean:srcset', cleanSrcset);

export default cleanSrcset;
