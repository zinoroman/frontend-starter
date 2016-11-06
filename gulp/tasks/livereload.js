import gulp from 'gulp';
import browserSync from 'browser-sync';
import paths from '../paths';

gulp.task('browser-sync', () => {
	return browserSync({
		files: ['./app/dist/css/**/*.css', './app/dist/js/**/*.js', './app/*.html'],
		server: paths.app
	});
});