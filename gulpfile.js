import gulp from "gulp";
import gulpLoader from "gulp-load-plugins";

let p = gulpLoader();

gulp.task("default", ["build"]);

gulp.task("build", ["blocks", "html"]);

gulp.task("blocks", () => {
  // TODO
});

gulp.task("html" () => {
  // TODO
});
