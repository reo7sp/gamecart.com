import $ from "jquery";
import Gallery from "./gallery.js"

$(".gallery__scroll-button").each(function() {
  let gallery = new Gallery($(this).parent(".gallery"));
  let isLeft = $(this).hasClass("gallery__scroll-button--left");

  $(this).click(function() {
    if (isLeft) {
      gallery.setPrevPhotoActive();
    } else {
      gallery.setNextPhotoActive();
    }

    $(".pagination-dots").each(function() {
      if ($($(this).data("paginable")).is(gallery.el)) {
        let dots = $(this).find(".pagination-dots__dot");
        let dot = dots.eq(gallery.activePhotoIndex);

        dots.each(function() {
          $(this).removeClass("pagination-dots__dot--active");
          if (!$(this).hasClass("pagination-dots__dot--inactive")) {
            $(this).addClass("pagination-dots__dot--inactive");
          }
        });
        dot.removeClass("pagination-dots__dot--inactive");
        dot.addClass("pagination-dots__dot--active");
      }
    });
  });
});
