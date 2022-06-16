"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = poll;

/**
 * Poll for the truthyness of a function and run callback when true
 * @param {function} tfn - function to run to test - must return a boolean
 * @param {function} cb - callback to fire when obj is found
 * @param {number} pollInterval - time interval between polls
 * @param {number} pollLimit - how many times to poll before giving up
 */
function poll(tfn, cb) {
  var pollInterval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var pollLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var x = 0;

  var timeout = function timeout() {
    window.setTimeout(doPoll, pollInterval);
  };

  var doPoll = function doPoll() {
    var r = tfn();

    if (r) {
      cb();
    } else if (!r && x++ < pollLimit) {
      timeout();
    }
  };

  timeout();
}