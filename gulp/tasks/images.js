import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import gaze from 'gaze';
import paths from '../paths'

gulp.task('images:watch', () => {
    return gaze([
                `${paths.src.images}/**/*.png`, 
                `${paths.src.images}/**/*.jpg`, 
                `${paths.src.images}/**/*.svg`,
                `${paths.src.images}/**/*.gif`], 
            function (event, filepath) {
        // On changed/added/deleted 
        this.on('all', (event, filepath) => {
            gulp.start('images:optimize');
        });
    });
});

gulp.task('images:optimize', () => {
    return gulp.src([`${paths.src.images}/**/*.png`, 
                    `${paths.src.images}/**/*.jpg`, 
                    `${paths.src.images}/**/*.svg`,
                    `${paths.src.images}/**/*.gif`])
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.images));
});

gulp.task('images:default', ['images:optimize', 'images:watch']);