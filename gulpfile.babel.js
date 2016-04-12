import gulp from "gulp";
import gulpPluginLoader from "gulp-load-plugins";

import fs from "fs";
import gutil from "gulp-util";
import { merge } from "event-stream";
import glob from "glob";

import scss from "postcss-scss";
import postcssImport from "postcss-import";
import precss from "precss";
import postcssAssets from "postcss-assets";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import oldie from "oldie";

const p = gulpPluginLoader();

const cssFiles = ["css/**/*.scss", "blocks/**/*.scss"];
const cssMainFile = "css/index.scss";
const jsMainFile = "js/index.js";
const jsFiles = "js/**/*.js";
const htmlFiles = ["index.html"];
const imageFiles = "images/**/*";
const destDir = "bin";

const postcssProcessors = [
  postcssImport(),
  precss(),
  //postcssAssets({
    //loadPaths: ["images/"]
  //}),
  //autoprefixer(),
  //cssnano()
];
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

function generateBlocksCss() {
  let files = glob.sync("blocks/**/*.scss");
  let txt = files.map(file => `@import "../${file}";`).join("\n");
  fs.writeFileSync("css/blocks.scss", txt);
}

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
  generateBlocksCss();

  let baseStream = gulp.src(cssMainFile)
    .pipe(p.plumber(plumberOptions))
    .pipe(p.sourcemaps.init())
    .pipe(p.postcss(postcssProcessors, {syntax: scss}));

  let normalCss = baseStream
    .pipe(p.rename("style.css"))
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest(destDir))
    .pipe(p.connect.reload());

  let ieCss = baseStream
    .pipe(p.postcss([oldie()]))
    .pipe(p.rename("style.oldie.css"))
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest(destDir))
    .pipe(p.connect.reload());

  return merge(normalCss, ieCss);
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

