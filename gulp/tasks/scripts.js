 import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import paths from '../paths';
import ts from 'gulp-typescript';
import webpack from 'webpack-stream';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import notifier from 'node-notifier';
import gaze from 'gaze';
import save from 'gulp-save';

gulp.task('scripts:watch', () => {
    return gaze([`${paths.src.ts}/**/*.ts`], function (event, filepath) {
        // On changed/added/deleted 
        this.on('all', (event, filepath) => {
            gulp.start('scripts:build');
        });

        this.on('added', (filepath) => {
            notifier.notify({
                title: 'Typescript Compiler Information',
                message: `File ${filepath} was added to typescript watch`
            });
        });

        this.on('deleted', (filepath) => {
            notifier.notify({
                title: 'Typescript Compiler Information',
                message: `File ${filepath} was deleted from typescript watch`
            });
        });
    });
});

gulp.task('scripts:compile', () => {
    const tsCompiler = webpack(require('../../webpack.config.js')).on('error', (e) => {
        gutil.log(e);
        tsCompiler.end();
    });

    return gulp.src(`${paths.src.ts}/main.ts`)
        .pipe(tsCompiler)
        .on('error', (error) => {
            notifier.notify({
                title: 'Typescript Error Happened 😞',
                message: `Here is a problem: ${error.message}`
            });
        })
        .pipe(gulp.dest(paths.src.js));
});

gulp.task('scripts:copyFromVendor', () => {
    return gulp.src([`${paths.vendor}/picturefill/dist/picturefill.min.js`])
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('scripts:build', ['scripts:compile', 'scripts:copyFromVendor'], () => {
    return gulp.src([
        `${paths.vendor}/autosize/dist/autosize.js`,
        `${paths.vendor}/bootstrap/js/transition.js`,
        `${paths.vendor}/bootstrap/js/dropdown.js`,
        `${paths.vendor}/bootstrap/js/collapse.js`,
        `${paths.vendor}/bootstrap/js/tooltip.js`,
        `${paths.vendor}/owl.carousel/dist/owl.carousel.js`,
        `${paths.vendor}/bootstrap-select/dist/js/bootstrap-select.js`,
        `${paths.vendor}/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js`,
        `${paths.vendor}/blueimp-gallery/js/jquery.blueimp-gallery.min.js`,
        `${paths.vendor}/blueimp-gallery/js/blueimp-gallery-video.js`,
        `${paths.vendor}/blueimp-gallery/js/blueimp-gallery-vimeo.js`,
        `${paths.vendor}/blueimp-gallery/js/blueimp-gallery-youtube.js`,
        `${paths.src.js}/libs/*.js`,
        `${paths.src.js}/bundle.js`])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(save('before-uglify'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(save.restore('before-uglify')) //restore all files to the state when we cached them
        .pipe(gulp.dest(paths.dist.js));
});


gulp.task('scripts:default', ['scripts:build', 'scripts:watch']);
