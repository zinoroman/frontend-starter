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

function handleCompilerError(error) {
    notifier.notify({
        title: 'Typescript Error Happened 😞',
        message: `Here is a problem: ${error.message}`
    });

    this.emit('end');
}

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

gulp.task('scripts:build', ['scripts:copyFromVendor'], () => {
    return gulp.src(`${paths.src.ts}/main.ts`)
        .pipe(webpack(require('../../webpack.config.js')))
            .on('error', handleCompilerError)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(save('before-uglify'))
        .pipe(uglify())
            .on('error', handleCompilerError)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(save.restore('before-uglify')) //restore all files to the state when we cached them
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('scripts:copyFromVendor', () => {
    return gulp.src([`${paths.vendor}/picturefill/dist/picturefill.min.js`])
        .pipe(gulp.dest(paths.dist.js));
});

gulp.task('scripts:default', ['scripts:build', 'scripts:watch']);
