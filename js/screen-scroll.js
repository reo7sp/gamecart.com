import $ from "jquery";
import { disableScroll } from "./block-scroll.js";

let _getScreens_cache = undefined;
function getScreens() {
  if (_getScreens_cache == undefined) {
    _getScreens_cache = $(".screen");
  }
  return _getScreens_cache;
}

function getCurrentScreen() {
  let curPos = document.body.scrollTop;

  let prevPos = -Infinity;
  let prevScreen = undefined;
  let nextPos = Infinity;
  let nextScreen = undefined;
  getScreens().each(function() {
    let pos = $(this).offset().top;
    if (pos < curPos) {
      if (pos > prevPos) {
        prevPos = pos;
        prevScreen = $(this);
      }
    } else {
      if (pos < nextPos) {
        nextPos = pos;
        nextScreen = $(this);
      }
    }
  });

  let middlePos = (prevPos + nextPos) / 2;
  if (middlePos < curPos) {
    return prevPos;
  } else {
    return nextPos;
  }
}

function scrollToScreen(screen) {
  $(document.body).animate({
    scrollTop: screen.offset().top
  }, 1000);
}


//$(window).scroll(function() {
  //scrollToScreen(getCurrentScreen());
//});
disableScroll();

$(".screen__scroll-button").click(function() {
  let screen = $(this).parent(".screen");
  let isUp = $(this).hasClass("screen__scroll-button--up");

  let newIndex = getScreens().index(screen);
  if (newIndex == -1) {
    return;
  }
  if (isUp) {
    newIndex -= 1;
  } else {
    newIndex += 1;
  }

  if (newIndex >= 0 && newIndex < getScreens().length) {
    scrollToScreen(getScreens().eq(newIndex));
  }
});
