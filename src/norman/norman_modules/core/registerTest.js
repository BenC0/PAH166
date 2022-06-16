"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = registerTest;

function registerTest(testID, variant, extraDetails) {
  window.norman = window.norman || {
    isPDP: isPDP(),
    isPLP: isPLP(),
    isHome: isHome(),
    pageType: pageType()
  };
  window.norman[testID] = {
    logs: [],
    variant: variant,
    testID: testID
  };

  for (var property in extraDetails) {
    window.norman[testID][property] = extraDetails[property];
  }
}