var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    less = require('gulp-less'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    spritesmith = require('gulp.spritesmith'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    cssmin = require('gulp-cssmin'),
    gulpSequence = require('gulp-sequence'),
    jsmin = require('gulp-jsmin'),
    image = require('gulp-image'),
    newer = require('gulp-newer'),
    cached = require('gulp-cached');


gulp. task('html', function () {
    gulp.src('src/**/*.html') // Выберем файлы по нужному пути
        .pipe(sourcemaps.init())
        .pipe(rigger()) // Прогоним через rigger
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
    // Переместим их в папку build
});

gulp.task('css', function () {
    gulp.src('src/less/style.less') // Выберем наш style.less
    .pipe(sourcemaps.init())
        .pipe(less()) // Скомпилируем
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    gulp.src('src/js/*.js') // Выберем файлы по нужному пути
        .pipe(cached('src/js/*.js'))
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
});

gulp.task('libs', function () {
    gulp.src('src/libs/**/*.*') // Выберем файлы по нужному пути
        .pipe(gulp.dest('build/libs/'))
        .pipe(browserSync.stream());
});

gulp.task('sprite', function () {
    var sprite = gulp.src('src/img/icons/*.png').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: 'sprite.less',
        cssFormat: 'less',
        algorithm: 'binary-tree',
        padding: 10
    }));
    sprite.img.pipe(rename('sprite.png')).pipe(gulp.dest('build/img/')).pipe(browserSync.stream());
    sprite.css.pipe(gulp.dest('src/less/imports/')).pipe(browserSync.stream());
});

gulp.task('img', function () {
    gulp.src('src/img/**/*.*') // Выберем наши картинки
        .pipe(newer('build/img'))
        .pipe(image({
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10
        }))
        .pipe(gulp.dest('build/img/'));
    // Переместим в build
});

gulp.task('png', function () {
    gulp.src('src/img/**/*.png')
        .pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function () {
    gulp.src('src/fonts/**/*.*') // Выберем файлы по нужному пути
        .pipe(gulp.dest('build/css/fonts'))
        .pipe(browserSync.stream());
    // Переместим их в папку build
});

gulp.task('mincss', function(){
    gulp.src('src/min/css/*.*')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/min/min/mincss/'));
});

gulp.task('minjs', function(){
    gulp.src('src/min/js/*.*')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/min/min/minjs/'));
});

gulp.task('cleanmin', function (cb) {
    rimraf('src/min/min/', cb);
});

gulp.task('clean', function (cb) {
    rimraf('build/', cb);
});

gulp.task('build', [
    'html',
    'css',
    'fonts',
    'js',
    'img',
    'sprite',
    'libs'
]);

gulp.task('browser-sync', function () {

    browserSync.init({
        server: "./build",
        notify: true
    });
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/less/**/*.less', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/img/**/*.*', ['img']);
    gulp.watch('src/img/icons/*.*', ['sprite']);
});


//     // Serve files from the root of this project
gulp.task('default', ['build', 'browser-sync', 'watch']);
//     // add browserSync.reload to the tasks array to make
//     // all browsers reload after tasks are complete.
