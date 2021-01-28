const gulp = require('gulp');
const sass = require('gulp-sass');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const fs = require('fs');


//-----------------------------------------------------------------------------
// Compile Scss
//-----------------------------------------------------------------------------
function scss() {
    return gulp.src('./src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError,))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./www/assets/css'))
        .pipe(browserSync.stream());
}

//-----------------------------------------------------------------------------
// Compile JS File
//-----------------------------------------------------------------------------
const bundleJS = () => {
    return browserify("./src/js/app.js")
        .transform("babelify", { presets: ["@babel/preset-env"], })
        .bundle()
        .pipe(fs.createWriteStream("./www/assets/js/bundle.js"));
}

//-----------------------------------------------------------------------------
// Gulp Watch
//-----------------------------------------------------------------------------
function watch() {
    browserSync.init({
        server: {
            baseDir: './www/',
            index: 'index.html'
        }
    });
    gulp.watch('./src/scss/**/*.scss', scss);
    gulp.watch("./src/js/**/*.js", bundleJS).on('change', browserSync.reload);
    gulp.watch('./www/**/*.html').on('change', browserSync.reload);
}

//-----------------------------------------------------------------------------
// TIME FOR BUILD
//-----------------------------------------------------------------------------
// Create 
function buildHTML() {
    console.log("🔥 Creating the files...")
    return gulp.src('./www/**/*')
        .pipe(gulp.dest('./build'))
}
// Build Javascript
function buildJS() {
    console.log("🔥 Minifying the Javascript files...")
    return gulp.src('./build/assets/js/**/*')
        .pipe(uglify())
        .pipe(gulp.dest('./build/assets/js'))
}
// Build CSS
function buildCSS() {
    console.log("🔥 Minifying the CSS files...")
    var processors = [
        cssnano()
    ];
    return gulp.src('./build/assets/css/**/*')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/assets/css/')); 
}

// Exports
exports.scss = scss;
exports.watch = watch;
exports.bundleJS = bundleJS;
exports.build = gulp.series(buildHTML, buildJS, buildCSS)
