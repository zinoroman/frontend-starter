import gulp from 'gulp';
import browserSync from 'browser-sync';
import paths from '../paths';

gulp.task('browser-sync', () => {
	return browserSync({
		files: [
			`${paths.dist.css}/**/*.css`,
			`${paths.dist.js}/**/*.js`,
			`${paths.app}/*.html`
		],
		server: paths.app
	});
});