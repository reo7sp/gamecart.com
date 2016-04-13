import $ from "jquery";

export default class Gallery {
  constructor(jqEl) {
    this.el = jqEl;
  }

  get activePhotoIndex() {
    let result = undefined;
    this.photos.each(function(i) {
      if ($(this).hasClass("gallery__photo--active")) {
        result = i;
        return false;
      }
    });
    return result;
  }

  set activePhotoIndex(index) {
    this.photos.each(function(i) {
      if (index == i) {
        $(this).removeClass("gallery__photo--inactive");
        if (!$(this).hasClass("gallery__photo--active")) {
          $(this).addClass("gallery__photo--active");
        }
      } else {
        $(this).removeClass("gallery__photo--active");
        if (!$(this).hasClass("gallery__photo--inactive")) {
          $(this).addClass("gallery__photo--inactive");
        }
      }
    });
  }

  get photos() {
    return this.el.find(".gallery__photo");
  }

  setNextPhotoActive() {
    this.activePhotoIndex = (this.activePhotoIndex + 1) % this.photos.length;
  }

  setPrevPhotoActive() {
    let newIndex = this.activePhotoIndex - 1;
    if (newIndex < 0) {
      newIndex = this.photos.length - newIndex;
    }
    this.activePhotoIndex = newIndex;
  }
}
