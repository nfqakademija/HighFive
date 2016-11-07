'use strict';

var gulp    = require('gulp');
var sass    = require('gulp-sass');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var dir = {
    assets: './src/AppBundle/Resources/',
    dist: './web/',
    npm: './node_modules/',
};

gulp.task('sass', function() {
    gulp.src(dir.assets + 'style/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 20 versions', 'IE 10'], flexbox: 'no-2009'}))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dir.dist + 'css'));
});

gulp.task('scripts', function() {
    gulp.src([
            //Third party assets
            dir.npm + 'jquery/dist/jquery.min.js',
            dir.npm + 'bootstrap-sass/assets/javascripts/bootstrap.min.js',
            dir.npm + 'fabric/dist/fabric.js',

            // Main JS files
            dir.assets + 'scripts/*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dir.dist + 'js'));
});

gulp.task('images', function() {
    gulp.src([
            dir.assets + 'images/**'
        ])
        .pipe(gulp.dest(dir.dist + 'images'));
});

gulp.task('fonts', function() {
    gulp.src([
        dir.npm + 'bootstrap-sass/assets/fonts/**'
        ])
        .pipe(gulp.dest(dir.dist + 'fonts'));
});

gulp.task('watch', function() {
    gulp.watch(dir.assets + 'style/main.scss', ['sass']);
    gulp.watch(dir.assets + 'scripts/*.js', ['scripts']);
    gulp.watch(dir.assets + 'images/**', ['images']);
});

gulp.task('default', ['watch', 'sass', 'scripts', 'fonts', 'images']);
