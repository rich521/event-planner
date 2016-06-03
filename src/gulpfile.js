var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    cleanCSS = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin');


gulp.task('default', ['styles', 'lint', 'compress', 'minify-css', 'minify-html'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch('js/**/*.js', ['lint', 'compress']).on('change', browserSync.reload);
    gulp.watch('sass/**/*.scss', ['styles', 'minify-css']);
    gulp.watch("*.html", ['minify-html']).on('change', browserSync.reload);
});

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths. 
    // So, it's best to have gulp ignore the directory as well. 
    // Also, Be sure to return the stream from the task; 
    // Otherwise, the task may end before the stream has finished. 
    return gulp.src(['js/**/*.js', '!js/ie10-bug.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on 
        // lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
});

gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('compress', function () {
    return gulp.src('js/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('../dist/js'));
});

gulp.task('minify-css', function () {
    return gulp.src('css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('../dist/css'));
});

gulp.task('minify-html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('../dist'))
});
