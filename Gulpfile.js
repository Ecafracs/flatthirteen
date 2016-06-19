var path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    input = [
        path.join(__dirname, '*.scss'),
        path.join(__dirname, 'app', '*.scss')
    ],
    output = [
        __dirname,
        path.join(__dirname, 'app')
    ],
    sassOptions = {
        errLogToConsole: true,
        outputStyle: 'expanded'
    };


gulp.task('sass:cwd', function () {
    return gulp
        .src(input[0])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output[0]));
});

gulp.task('sass:appdir', function () {
    return gulp
        .src(input[1])
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output[1]));
});

gulp.task('sass', ['sass:cwd', 'sass:appdir']);

gulp.task('watch', function () {
    return gulp
        .watch(input, ['sass'])
        .on('change', function (e) {
            console.log('File: ' + e.path + ', event: ' + e.type);
        });
});

gulp.task('default', ['sass', 'watch']);