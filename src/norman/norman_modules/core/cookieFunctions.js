"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
exports.exists = exists;
exports["default"] = void 0;

/* Function to set a cookie. Default expiration date is 30 days. */
function set(cname, cvalue) {
  var exdays = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
  var d = new Date();
  /* Change this value to change the expiration date. The value is an integer of days */

  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/* function to retrieve a cookie value */


function get() {
  var cname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (cname != false) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }

  return "";
}
/* Function to check a cookie exists */


function exists() {
  var cookieName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  /* If cookieName is not false and exists */
  if (!!cookieName) {
    /* Return result of getCookie not equal to an empty string */
    return getCookie(cookieName) !== "";
  }

  return false;
}

var _default = {
  set: set,
  get: get,
  exists: exists
};
exports["default"] = _default;