"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function setCookie(name, value, options) {
  options = options || {};
  var days = options.days || options.expires || '';
  var cpath = options.path || '';
  var domain = options.domain || '';
  var secure = options.secure || '';

  if (!name) {
    throw new Error('Cookie must have name.');
  } else if (!value) {
    throw new Error('Cookie must have value.');
  }

  if (_typeof(value) === 'object') {
    value = JSON.stringify(value);
  }

  value = escape(value);
  var cookieString = "".concat(name, "=").concat(value);

  if (days) {
    var time = new Date();
    var expires = time.setDate(time.getDate() + days);
    cookieString += "; expires=".concat(new Date(expires).toGMTString());
  }

  if (cpath) cookieString += "; path=".concat(cpath);
  if (domain) cookieString += "; domain=".concat(domain);
  if (secure) cookieString += "; secure";
  document.cookie = cookieString;
}

function getCookie(name) {
  var findName = new RegExp(name + '=([^;]*)');
  var result = findName.test(document.cookie) ? unescape(RegExp.$1) : ''; // try deserialize

  try {
    var resultJSON = JSON.parse(result);
    result = resultJSON;
  } // it is not a object!
  catch (e) {}

  return result;
}

function deleteCookie(name) {
  document.cookie = "".concat(name, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC");
}

module.exports = {
  set: setCookie,
  get: getCookie,
  delete: deleteCookie
};