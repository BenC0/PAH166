"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = log;

function log(testID, msg) {
  var date = new Date();
  window.norman[testID].logs.push({
    "msg": msg,
    "id": "".concat(testID, ":").concat(window.norman[testID].logs.length),
    "time": date.toTimeString(),
    "date": date.toDateString()
  });
}