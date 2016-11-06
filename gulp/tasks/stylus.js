import gulp from 'gulp';
import stylus from 'gulp-stylus';
import concat from 'gulp-concat';
import rupture from 'rupture';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import bootstrap from 'bootstrap-styl';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import gutil from 'gulp-util';
import notifier from 'node-notifier';
import paths from '../paths';
import save from 'gulp-save';
import gaze from 'gaze';

gulp.task('stylus:watch', () => {
    return gaze([`${paths.src.stylus}/**/*.styl`], function(event, filepath) {
         // On changed/added/deleted 
        this.on('all', (event, filepath) => {
            gulp.start('stylus:build');
        });

        this.on('added', (filepath) => {
            notifier.notify({
                title: 'Stylus Compiler Information',
                message: `File ${filepath} was added to stylus watch`
            });
        });

        this.on('deleted', (filepath) => {
            notifier.notify({
                title: 'Stylus Compiler Information',
                message: `File ${filepath} was deleted from stylus watch`
            });
        });
    });
});

gulp.task('stylus:build', () => {
    const stylusCompiler = stylus({
        use: [rupture(), bootstrap()],
        'include css': true
    }).on('error', (e) => {
        gutil.log(e);
        stylusCompiler.end();
    });

    return gulp
        .src([`${paths.src.stylus}/main.styl`])
        .pipe(sourcemaps.init())
        .pipe(stylusCompiler)
        .on('error', (error) => {
            notifier.notify({
                title: 'Stylus Error Happened 😞',
                message: `Here is a problem: ${error.message}`
            });
        })
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 2 versions', 'ie 10', 'android 4']
            })
        ]))
        .pipe(save('before-uglify'))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(save.restore('before-uglify')) //restore all files to the state when we cached them
        .pipe(gulp.dest(paths.dist.css));
});

gulp.task('stylus:default', ['stylus:build', 'stylus:watch']);