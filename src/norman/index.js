'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function nLog(testID, event) {
  var warn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var date = new Date();
  var eventObject = {
    "event": event,
    "id": "".concat(testID, ":").concat(window.norman[testID].logs.length),
    "time": date.toTimeString(),
    "date": date.toDateString()
  };
  window.norman[testID].logs.push(eventObject);

  if (warn) {
    console.warn(eventObject);
  }
}

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
  var fallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var x = 0;

  var timeout = function timeout() {
    window.setTimeout(doPoll, pollInterval);
  };

  var doPoll = function doPoll() {
    var r = tfn();
    x++;

    if (r) {
      cb();
    } else if (!r && x < pollLimit) {
      timeout();
    } else if (!!fallback && !r && x >= pollLimit) {
      fallback();
    }
  };

  timeout();
}

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

function get$1() {
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

function exists$1() {
  var cookieName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  /* If cookieName is not false and exists */
  if (!!cookieName) {
    /* Return result of getCookie not equal to an empty string */
    return getCookie(cookieName) !== "";
  }

  return false;
}
var cookieFunctions = {
  set: set,
  get: get$1,
  exists: exists$1
};

function registerTest(testID, variant, extraDetails) {
  var testConfig = {
    variant: variant,
    id: testID
  };

  for (var property in extraDetails) {
    testConfig[property] = extraDetails[property];
  }

  window.norman = window.norman || [];
  window.norman[testID] = {
    logs: [],
    testConfig: testConfig
  };
  return window.norman[testID];
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function get(selector) {
  var all = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  // Get element
  var els = [];

  if (all && typeof selector === "string" && selector.replace(/ /g, '') !== "") {
    els = _toConsumableArray(document.querySelectorAll(selector));
  } else {
    els = [document.querySelector(selector)];
  }

  return els.length !== 0 ? els : false;
}
function exists(input) {
  // Check element exists
  if (typeof input === "string") {
    return !!document.querySelector(input);
  }

  return !!input;
}
function add(html, target, method) {
  // add element to page
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  var tempEl = template.content.firstChild;
  var targetEl = document.querySelector(target);
  return targetEl.insertAdjacentElement(method, tempEl);
}
function remove(input) {
  // Remove element
  if (typeof input === "string") {
    input = document.querySelector(input);
  }

  input.remove();
}
var elementManagement = {
  get: get,
  exists: exists,
  add: add,
  remove: remove
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  var headerHeight = document.querySelector('header').getBoundingClientRect().height;
  return bounding.top >= headerHeight - bounding.height && bounding.left >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
}

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
  var observer_class = arguments.length > 0 && arguments[3] !== undefined ? arguments[3] : "observing";

  if (targetNode !== null) {
    if (!targetNode.classList.contains(observer_class)) {
      var observer = new MutationObserver(callback);
      targetNode.classList.add(observer_class);
      observer.observe(targetNode, config);
    }
  }
}

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

var Test = /*#__PURE__*/function () {
  function Test() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var google_analytics = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var hotjar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, Test);

    // Test ID
    this.id = id; // Tracking properties

    this.hotjar = hotjar;
    this.google_analytics = google_analytics;
    this.body_class = "".concat(this.id, "_loaded");
    this.register_test();
  }

  _createClass(Test, [{
    key: "register_test",
    value: function register_test() {
      window.norman = window.norman || [];
      window.norman[this.id] = window.norman[this.id] || {
        logs: []
      };
    }
  }]);

  return Test;
}();

var Variant = /*#__PURE__*/function (_Test) {
  _inherits(Variant, _Test);

  var _super = _createSuper(Variant);

  function Variant() {
    var _this;

    var test_config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      id: "",
      google_analytics: false,
      hotjar: false
    };
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Variant";
    var conditions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var actions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var fallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, Variant);

    _this = _super.call(this, test_config.id, test_config.google_analytics, test_config.hotjar);
    _this.name = name, _this.conditions = conditions;
    _this.actions = actions || _this.default_action;
    _this.fallback = fallback || _this.default_fallback;
    return _this;
  }

  _createClass(Variant, [{
    key: "default_action",
    value: function default_action() {
      this.log("No action specified", true);
    }
  }, {
    key: "default_fallback",
    value: function default_fallback() {
      this.log("No fallback specified", true);
    }
  }, {
    key: "log",
    value: function log(msg) {
      var warn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      nLog(this.id, msg, warn);
    }
  }, {
    key: "run",
    value: function run() {
      var _this2 = this;

      poll(function (_) {
        return _this2.conditions() && !document.body.classList.contains(_this2.body_class);
      }, function (_) {
        document.body.classList.add(_this2.body_class);

        _this2.track_impression();

        _this2.actions();
      }, 5, 10, function (_) {
        _this2.fallback();
      });
    }
  }, {
    key: "track_impression",
    value: function track_impression() {
      if (typeof this.google_analytics === "number") {
        var eventObject = {
          'event': 'CRO_Test_Impression',
          'dimension': this.google_analytics,
          'testID': this.id,
          'variation': this.name
        };
        this.track_event_object(eventObject);
      }

      this.track_content_square();
    }
  }, {
    key: "track_content_square",
    value: function track_content_square() {
      var csTypeVendorPrefix = "AB_ABT_";
      var csKey = csTypeVendorPrefix + this.id;
      window._uxa = window._uxa || [];

      _uxa.push(["trackDynamicVariable", {
        key: csKey,
        value: this.name
      }]);
    }
  }, {
    key: "track_event",
    value: function track_event(action) {
      var eventObject = {
        'event': 'CRO_Test_Event',
        'eventAction': "".concat(action),
        'eventLabel': "".concat(this.id, "-").concat(this.name)
      };
      this.track_event_object(eventObject);
    }
  }, {
    key: "track_event_object",
    value: function track_event_object(eventObject) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(eventObject);
      this.log({
        msg: "Tracked Event Object",
        eventObject: eventObject
      });
    }
  }]);

  return Variant;
}(Test);

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".nMask_container{position:relative}.nMask_container .nMask{background:#ededed;overflow:hidden}.nMask_container .nMask,.nMask_container .nMask:after{bottom:0;left:0;position:absolute;right:0;top:0;z-index:123456789}.nMask_container .nMask:after{-webkit-animation:nMask_glimmer 1s infinite;animation:nMask_glimmer 1s infinite;background:linear-gradient(90deg,transparent,#dcdcdc,transparent);content:\"\"}@-webkit-keyframes nMask_glimmer{0%{transform:translateX(-100%)}to{transform:translateX(100%)}}@keyframes nMask_glimmer{0%{transform:translateX(-100%)}to{transform:translateX(100%)}}";
styleInject(css_248z);

var TestElement = /*#__PURE__*/function () {
  function TestElement(selector) {
    _classCallCheck(this, TestElement);

    this.selector = selector; // Handle HTML strings

    if (typeof selector === "string") {
      if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
        // selector is a HTML string
        this.html = selector;
        this.selector = null;
      } else {
        this.selector = selector;

        this._get();

        this.html = this._html();
      }
    } else if (selector instanceof HTMLElement) {
      this.node = selector;
      this.html = this._html();
    } else {
      console.warn({
        msg: "Unknown selector variable type detected",
        selector: selector,
        type: _typeof(selector)
      });
    }
  }

  _createClass(TestElement, [{
    key: "get_node_path",
    value: function get_node_path() {
      if (!(this.node instanceof Element)) {
        return;
      }

      var el = this.node;
      var path = [];

      while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();

        if (el.id) {
          selector += '#' + el.id;
          path.unshift(selector);
          break;
        } else {
          var sib = el,
              nth = 1;

          while (sib = sib.previousElementSibling) {
            if (sib.nodeName.toLowerCase() == selector) nth++;
          }

          if (nth != 1) selector += ":nth-of-type(" + nth + ")";
        }

        path.unshift(selector);
        el = el.parentNode;
      }

      return path.join(" > ");
    }
    /*===================================
        Helper functions
    ===================================*/

  }, {
    key: "_get",
    value: function _get() {
      this.node = document.querySelector(this.selector);
      return this.node;
    }
  }, {
    key: "_find",
    value: function _find(selector) {
      return _toConsumableArray(this.node.querySelectorAll(selector)).map(function (a) {
        return new TestElement(a);
      });
    }
    /**
     * insert
     * @param {string} target - A CSS selector for the target element 
     * @param {("beforeBegin"|"beforeEnd"|"afterBegin"|"afterEnd")} [method="beforeEnd"] - the method for inserting an element via `insertAdjacentElement`
     */

  }, {
    key: "_insert",
    value: function _insert(target) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "beforeEnd";
      var template = document.createElement('template');
      template.innerHTML = this.html;
      var tempEl = template.content.firstChild;
      var targetEl = document.querySelector(target);
      this.node = targetEl.insertAdjacentElement(method, tempEl);
      this.selector = this.get_node_path();
      return this.node;
    }
  }, {
    key: "_append",
    value: function _append(element) {
      var template = document.createElement('template');
      template.innerHTML = element;
      var tempEl = template.content.firstChild;
      var targetEl = this.node;
      return targetEl.insertAdjacentElement("beforeEnd", tempEl);
    }
    /**
     * _text
     * If str param specified, textContent will be updated, if it is ommited, textContent is not changed.
     * @param {string} [str=""] - The text string to change textContent to, if specified.  
     * @returns node textContent
     */

  }, {
    key: "_text",
    value: function _text() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      if (str.length != 0) {
        this.node.textContent = str;
      }

      return this.node.textContent;
    }
    /**
     * _html
     * If str param specified, htmlContent will be updated, if it is ommited, htmlContent is not changed.
     * @param {string} [str=""] - The html string to change htmlContent to, if specified.  
     * @param {boolean} [innerHTML=false] - if `true`, innerHTML is user, else, outerHTML.  
     * @returns node innerHTML or outerHTML
     */

  }, {
    key: "_html",
    value: function _html() {
      var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var innerHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (str.length != 0) {
        if (innerHTML) {
          this.node.innerHTML = str;
        } else {
          this.node.outerHTML = str;
        }
      }

      if (innerHTML) {
        return this.node.innerHTML;
      } else {
        return this.node.outerHTML;
      }
    }
  }, {
    key: "_class",
    value: function _class() {
      var cls = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (cls.length != 0) {
        if (add) {
          this.node.classList.add(cls);
        } else {
          this.node.classList.remove(cls);
        }
      } else {
        return this.node.classList;
      }
    }
  }, {
    key: "_mask",
    value: function _mask() {
      var apply = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (apply) {
        this._class("nMask_container");

        this._append("<div class=\"nMask\"></div>");
      } else {
        this._class("nMask_container", false);

        this._find(".nMask").forEach(function (el) {
          return el.node.remove();
        });
      }
    }
  }]);

  return TestElement;
}();

var TestElements = /*#__PURE__*/function () {
  function TestElements(selector) {
    _classCallCheck(this, TestElements);

    if (typeof selector === "string") {
      this.selector = selector; // Handle HTML strings

      this._get();
    }
  }
  /*===================================
      Helper functions
  ===================================*/


  _createClass(TestElements, [{
    key: "_get",
    value: function _get() {
      this.nodes = _toConsumableArray(document.querySelectorAll(this.selector)).map(function (a) {
        return new TestElement(a);
      });
      return this.nodes;
    }
  }, {
    key: "_loop",
    value: function _loop(func) {
      this.nodes.forEach(function (node, index) {
        return func(node, index);
      });
    }
  }]);

  return TestElements;
}();

exports.Test = Test;
exports.TestElement = TestElement;
exports.TestElements = TestElements;
exports.Variant = Variant;
exports.cookie = cookieFunctions;
exports.debounce = debounce;
exports.elementManagement = elementManagement;
exports.getHighestZIndex = getHighestZIndex;
exports.isInViewport = isInViewport;
exports.nLog = nLog;
exports.onMouseLeave = onMouseLeave;
exports.poll = poll;
exports.registerTest = registerTest;
exports.watchForChange = watchForChange;
