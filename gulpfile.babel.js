import gulp from "gulp";
import gulpPluginLoader from "gulp-load-plugins";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";

import fs from "fs";
import gutil from "gulp-util";
import { merge } from "event-stream";
import glob from "glob";

const p = gulpPluginLoader();

const cssMainFile = "css/index.styl";
const cssFiles = ["css/**/*.styl", "blocks/**/*.styl"];
const jsFiles = "js/**/*.js";
const jsMainFile = "js/index.js";
const htmlFiles = ["index.html"];
const imageFiles = "images/**/*";
const destDir = "bin";

const stylusOptions = {
  compress: true,
  "include css": true
};
const babelOptions = {
  presets: ["es2015"]
};
const serverOptions = {
  root: destDir,
  livereload: true
};
const plumberOptions = {
  errorHandler: function(err) {
    gutil.beep();
    gutil.log(
      gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
      err.toString()
    );
    this.emit("end");
  }
};


gulp.task("default", ["build"]);

gulp.task("build", ["css", "js", "html", "images"]);

gulp.task("watch", ["build"], () => {
  gulp.watch(cssFiles, ["css"]);
  gulp.watch(jsFiles, ["js"]);
  gulp.watch(htmlFiles, ["html"]);
  gulp.watch(imageFiles, ["images"]);

  return p.connect.server(serverOptions);
});

gulp.task("css", () => {
  return gulp.src(cssMainFile)
    .pipe(p.plumber(plumberOptions))
    .pipe(p.sourcemaps.init())
    .pipe(p.stylus(stylusOptions))
    .pipe(p.rename("style.css"))
    .pipe(p.autoprefixer())
    .pipe(p.cssnano())
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest(destDir))
    .pipe(p.connect.reload());
});

gulp.task("js", () => {
  return browserify(jsMainFile)
    .transform("babelify", babelOptions)
    .bundle()
    .pipe(p.plumber(plumberOptions))
    .pipe(source("app.js"))
    .pipe(buffer())
    .pipe(p.sourcemaps.init({loadMaps: true}))
    .pipe(p.uglify())
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest(destDir))
    .pipe(p.connect.reload());
});

gulp.task("html", () => {
  return gulp.src(htmlFiles)
    .pipe(p.plumber(plumberOptions))
    .pipe(p.nunjucks.compile())
    .pipe(p.htmlmin())
    .pipe(gulp.dest(destDir))
    .pipe(p.connect.reload());
});

gulp.task("images", () => {
  return gulp.src(imageFiles)
    .pipe(gulp.dest(`${destDir}/images`))
    .pipe(p.connect.reload());
});

