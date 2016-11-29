'use strict';

var gulp    = require('gulp');
var sass    = require('gulp-sass');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

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

            // Three js Library assets
            dir.npm + 'three/build/three.js',
            dir.npm + 'three/examples/js/Detector.js',
            dir.npm + 'three/examples/js/loaders/DDSLoader.js',
            dir.npm + 'three/examples/js/loaders/MTLLoader.js',
            dir.npm + 'three/examples/js/loaders/OBJLoader.js',
            dir.npm + 'three/examples/js/controls/OrbitControls.js',
            dir.npm + 'three/examples/js/renderers/Projector.js',

            // Main JS files
            dir.assets + 'scripts/*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(dir.dist + 'js'));
});

// Optimize Images
gulp.task('images', function () {
    gulp.src([
            dir.assets + 'images/**/*'
        ])
        .pipe(cache(imagemin({
            progressive: true,
            interlaced: true,
            pngquant: true
        })))
        .pipe(gulp.dest(dir.dist + 'images'));
});

gulp.task('fonts', function() {
    gulp.src([
        dir.npm + 'bootstrap-sass/assets/fonts/**'
        ])
        .pipe(gulp.dest(dir.dist + 'fonts'));
});

gulp.task('json', function() {
    gulp.src([
        dir.assets + 'scripts/*.json'
        ])
        .pipe(gulp.dest(dir.dist + 'js'));
});

gulp.task('models', function() {
    gulp.src([
        dir.assets + 'models/**'
        ])
        .pipe(gulp.dest(dir.dist + 'models'));
});

gulp.task('watch', function() {
    gulp.watch(dir.assets + 'style/**', ['sass']);
    gulp.watch(dir.assets + 'scripts/*.js', ['scripts']);
    gulp.watch(dir.assets + 'images/**/*', ['images']);
});

gulp.task('default', ['sass', 'scripts', 'json', 'fonts', 'images', 'models']);
