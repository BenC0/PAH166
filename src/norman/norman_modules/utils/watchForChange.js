"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = watchForChange;

function watchForChange() {
  var targetNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (mutationsList, observer) {
    console.log(mutationsList, observer);
  };
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    attributes: true,
    childList: true,
    subtree: true
  };

  if (targetNode !== null) {
    if (!targetNode.classList.contains("observing")) {
      var observer = new MutationObserver(callback);
      targetNode.classList.add('observing');
      observer.observe(targetNode, config);
    }
  }
}