var gulp = require('gulp'),
watch = require('gulp-watch');

gulp.task('watch', function() {
    watch('./index.html');
    watch('./app.js');
    });