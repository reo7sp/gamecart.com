import gulp from "gulp";
import gulpLoader from "gulp-load-plugins";

import { merge } from "event-stream";

import precss from "precss";
import autoprefixer from "autoprefixer";
import stylelint from "stylelint";
import cssnano from "cssnano";
import oldie from "oldie";

const p = gulpLoader();

const postcssProcessors = [
  precss(),
  autoprefixer(),
  stylelint(),
  cssnano()
];
const babelOptions = {
  presets: ["es2015"]
};

const blocksCssFiles = "blocks/**/*.css";
const htmlFiles = ["index.html"];
const destDir = "bin";
const jsMainFile = "js/index.js";

gulp.task("default", ["build"]);

gulp.task("build", ["blocks", "js", "html"]);

gulp.task("blocks", () => {
  let baseStream = gulp.src(blocksCssFiles)
    .pipe(p.cached("blocks"))
    .pipe(p.postcss(postcssProcessors))
    .pipe(p.remember("blocks"))
    .pipe(p.concat("style.css"));

  let normalCss = baseStream
    .pipe(gulp.dest(destDir));

  let ieCss = baseStream
    .pipe(p.postcss([oldie()]))
    .pipe(p.rename("style.oldie.css"))
    .pipe(gulp.dest(destDir));

  return merge(normalCss, ieCss);
});

gulp.task("js", () => {
  return gulp.src(jsMainFile)
    .pipe(p.sourcemaps.init())
    .pipe(p.babel(babelOptions))
    .pipe(p.sourcemaps.write("."))
    .pipe(gulp.dest(destDir));
});

gulp.task("html", () => {
  return gulp.src(htmlFiles)
    .pipe(p.cached("html"))
    .pipe(p.nunjucks.compile())
    .pipe(p.remember("html"))
    .pipe(gulp.dest(destDir));
});
