import $ from "jquery";
import Gallery from "./gallery.js"

$(".pagination-dots").each(function() {
  let paginableName = $(this).data("paginable");
  if (paginableName == undefined) {
    return true;
  }
  let paginable = $(paginableName);

  let dots = $(this).find(".pagination-dots__dot");
  dots.each(function(i) {
    let gallery = new Gallery(paginable);
    $(this).click(function() {
      gallery.activePhotoIndex = i;

      dots.each(function() {
        $(this).removeClass("pagination-dots__dot--active");
        if (!$(this).hasClass("pagination-dots__dot--inactive")) {
          $(this).addClass("pagination-dots__dot--inactive");
        }
      });
      $(this).removeClass("pagination-dots__dot--inactive");
      $(this).addClass("pagination-dots__dot--active");
    });
  });
});
