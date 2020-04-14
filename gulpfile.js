const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
//не ставил gulp-concat
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');


const isDev = true;
const isProd = !isDev;


function clear(){
    return del('build/*');
}

function styles (){
    return gulp.src ('./src/css/style.less')
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(less())
        .pipe(gcmq())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(isProd, cleanCSS({
            level: 2
        })))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function img (){
    return gulp.src ('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
}

function html(){
	return gulp.src('./src/*.html')
               .pipe(gulp.dest('./build'))
               .pipe(browserSync.stream());
}

function watch(){

    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

    gulp.watch('./src/css/**/*.css', styles) //наблюдает за цсс, делает функцию стайлс при любом изменении в файле
    gulp.watch('./src/**/*.html', html);
}

let build = gulp.series(clear,
    gulp.parallel(styles, img, html))

// gulp.task('css', styles)
// gulp.task('img', img)
// gulp.task('html', html)
// gulp.task('clr', clear)

gulp.task('bld', build)
gulp.task('watch', gulp.series(build, watch))
