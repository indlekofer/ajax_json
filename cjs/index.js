"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ERROR_TIMEOUT", {
  enumerable: true,
  get: function get() {
    return _constants.ERROR_TIMEOUT;
  }
});
Object.defineProperty(exports, "ERROR_JSON", {
  enumerable: true,
  get: function get() {
    return _constants.ERROR_JSON;
  }
});
Object.defineProperty(exports, "ERROR_REJECT", {
  enumerable: true,
  get: function get() {
    return _constants.ERROR_REJECT;
  }
});
exports["default"] = exports.config = void 0;

var _format_url = _interopRequireDefault(require("@indlekofer/format_url"));

var _promise = _interopRequireDefault(require("promise"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = function config(settings) {
  //defaults
  settings.url = settings.url || '/';
  settings.query = settings.query || {};
  settings.method = settings.method || 'GET';
  settings.async = settings.async || true;
  settings.header = settings.header || {};
  settings.withCredentials = settings.withCredentials || false;
  settings.timeout = settings.timeout || 3000;

  if (typeof settings.auth == 'undefined' || settings.auth === null || settings.auth === '' || !settings.auth) {
    settings.auth = false;
  }

  if (typeof settings.body == 'undefined' || settings.body === null || settings.body === '' || !settings.body) {
    settings.body = false;
  } else {
    settings.body = JSON.stringify(settings.body, undefined, 0);
  }
};

exports.config = config;

var _default = function _default(settings) {
  var req = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new XMLHttpRequest();
  return new _promise["default"](function (resolve, reject) {
    //var req = new XMLHttpRequest();
    //mutate settings with some defaults
    config(settings); //callbacks

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status == 0 && req.statusText == null) {
          req.error = _constants.ERROR_REJECT;
          reject(req);
        } else {
          req.error = false;

          try {
            if (req.responseText == '') req.responseBody = {};else req.responseBody = JSON.parse(req.responseText);
            resolve(req);
          } catch (e) {
            req.error = _constants.ERROR_JSON;
            reject(req);
          }
        }
      }
    };

    req.ontimeout = function () {
      req.error = _constants.ERROR_TIMEOUT;
      reject(req);
    };

    req.withCredentials = settings.withCredentials;
    req.timeout = settings.timeout;
    req.open(settings.method, (0, _format_url["default"])(settings.url, settings.query), settings.async); //headers

    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (settings.auth !== false) req.setRequestHeader('Authentication', settings.auth); //send

    if (!settings.body) req.send();else req.send(settings.body);
  });
};

exports["default"] = _default;