var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var gzip = require('gulp-gzip');
var s3 = require('gulp-s3-gzip');

var fs = require('fs');
var aws = {
  bucket: 'angular-up.com',
  region: 'us-west-2', // Oregon
  secret: process.env.ANGULAR_UP_AWS_SECRET,
  key: process.env.ANGULAR_UP_AWS_KEY
};

gulp.task('js', () => {
  gulp.src('js/*.js')
    .pipe(uglify({
      mangle: true
    }))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('css', () => {
  gulp.src('stylesheets/main.scss')
    .pipe(sass.sync())
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/stylesheets'))
});

gulp.task('html', () => {
  gulp.src('*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('images', () => {
  gulp.src('images/**')
    .pipe(gulp.dest('./dist/images'))
});

gulp.task('upload', () => {
  gulp.src('dist/**')
    .pipe(gzip())
    .pipe(s3(aws, {
      gzippedOnly: true,
      removeGzipExtension: true
    }))
});

gulp.task('build', () => {
  gulp.run('images', 'js', 'css', 'html')
});