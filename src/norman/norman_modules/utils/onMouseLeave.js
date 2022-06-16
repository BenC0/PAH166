"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = onMouseLeave;

/**
 * Function to initialise the mouse leave detection function.
 * @param {function} callback - The function to run when the conditions have returned true
 * @param {number}  [threshold=5] - Threshold set for mouse y position
*/
function onMouseLeave(callback) {
  var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;

  /* declare conditionCheck function as variable and pass the event to the function */
  var conditionCheck = function conditionCheck(event) {
    /* check if mouse y position is less than threshold (defaults to 5) */
    if (event.y < threshold) {
      /* call callback function */
      callback();
    }
  },

  /* declare listenerController function to easily handle adding and removing the event listener */
  listenerController = function listenerController(method) {
    switch (method) {
      case "add":
        document.body.addEventListener("mouseleave", conditionCheck, false);
        break;

      case "remove":
        document.body.removeEventListener("mouseleave", conditionCheck, false);
        break;
    }
  },
      select = document.getElementsByTagName("select");
  /* attach mouse leave event to body, call conditionCheck when mouse leave event detected */


  document.body.addEventListener("mouseleave", conditionCheck, false);
  /* The following focusin and focusout event functions are for cross-browser compatibility. 
      They ensure the condition check is not called on Edge, IE and possibly Firefox when a select element is focused, remove the event listener, when it is blurred, add the event listener */

  for (var i = 0, length1 = select.length; i < length1; i++) {
    select[i].addEventListener("focus", listenerController("remove"), false);
    select[i].addEventListener("blur", listenerController("add"), false);
  }
}