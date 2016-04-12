import gulp from "gulp";
import gulpPluginLoader from "gulp-load-plugins";

import fs from "fs";
import gutil from "gulp-util";
import { merge } from "event-stream";
import glob from "glob";

const p = gulpPluginLoader();

const cssMainFile = "css/index.styl";
const cssFiles = ["css/**/*.less", "blocks/**/*.less"];
const jsFiles = "js/**/*.js";
const jsMainFile = "js/index.js";
const htmlFiles = ["index.html"];
const imageFiles = "images/**/*";
const destDir = "bin";

const stylusOptions = {
  compress: true
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
  return gulp.src(jsMainFile)
    .pipe(p.plumber())
    .pipe(p.sourcemaps.init())
    .pipe(p.rename("app.js"))
    .pipe(p.babel(babelOptions))
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest(destDir))
    .pipe(p.connect.reload());
});

gulp.task("html", () => {
  return gulp.src(htmlFiles)
    .pipe(p.plumber())
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

