var gulp=require('gulp');
var gulpImport = require('gulp-html-import');
var browserify = require("browserify");
var browserSync = require("browser-sync").create();
var tap = require("gulp-tap");
var sass = require("gulp-sass");
var buffer = require("gulp-buffer");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var notify = require("gulp-notify");
var Symbol = require('es6-symbol');
var babelify=require('babelify-es6-polyfill');
var imagemin = require("gulp-imagemin");
var responsive = require("gulp-responsive");
var cpy = require('cpy')


gulp.task("default",["importHtml","js","imgres","sass","fonts"], function(){

    browserSync.init({proxy:"http://127.0.0.1:3100/"});

    gulp.watch(["src/*.html", "src/**/*.html"], ["importHtml"]);

    gulp.watch(["src/scss/*.scss", "src/scss/**/*.scss"], ["sass"]);

    gulp.watch(["src/js/*.js", "src/js/**/*.js"], ["js"]);
});

gulp.task("sass", function(){
    gulp.src("src/scss/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", function(error){
            return notify().write(error);
        }))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/css/"))
        //.pipe(browserSync.stream())
        //.pipe(notify("SASS Compilado 🤘🏻"))
});

gulp.task('importHtml', function () {
    gulp.src('./src/*.html')
        .pipe(gulpImport('./src/components/'))
        .pipe(gulp.dest('dist'))
        //.pipe(browserSync.stream());
});

gulp.task("js", function(){
    gulp.src("src/js/main.js")
        .pipe(tap(function(file){ 
            file.contents = browserify(file.path, {debug: true})
                            .transform("babelify", {presets: ["es2015"]})
                            .bundle()
                            .on("error", function(error){
                                return notify().write(error);
                            });
        }))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/"));
});

gulp.task("fonts", function(){
    cpy(['src/fonts/*'], 'dist/fonts').then(() => {
        console.log('fuentes copiadas');
    });
    cpy(['src/css/*'], 'dist/css').then(() => {
        console.log('fuentes copiadas');
    });
});

gulp.task("imgres", function(){
    gulp.src("src/img/img-otros/*")
        .pipe(gulp.dest("dist/img/"));

    gulp.src("src/img/img-list/*")
        .pipe(responsive({
            '*': [
                { width: 225, rename: { suffix: "-225px"}},
                { width: 450, rename: { suffix: "-450px"}},
                { width: 675, rename: { suffix: "-675px"}},
                { width: 360, rename: { suffix: "-360px"}},
                { width: 720, rename: { suffix: "-720px"}},
                { width: 1080, rename: { suffix: "-1080px"}},
                { width: 180, rename: { suffix: "-180px"}},
                { width: 360, rename: { suffix: "-360px"}},
                { width: 540, rename: { suffix: "-540px"}}
            ]
        }))
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img/"));
    gulp.src("src/img/img-article/*")
        .pipe(responsive({
            '*': [
                { width: 550, rename: { suffix: "-550px"}},
                { width: 1100, rename: { suffix: "-1100px"}},
                { width: 1650, rename: { suffix: "-1650px"}},
            ]
        }))
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img/"));
});