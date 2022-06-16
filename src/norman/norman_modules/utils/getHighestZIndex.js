"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getHighestZIndex;

function getHighestZIndex() {
  var elem = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";
  var elems = document.getElementsByTagName(elem);
  var highest = Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1);

  for (var i = 0; i < elems.length; i++) {
    var zindex = Number.parseInt(document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index"), 10);

    if (zindex > highest) {
      highest = zindex;
    }
  }

  return highest;
}