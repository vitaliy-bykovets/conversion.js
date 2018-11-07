(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Conversion = factory());
}(this, (function () { 'use strict';

  var defaults = {
    containerToInsert: '.js-content-insert',
    containerToSearchLinks: 'body',
    disableAttribute: 'data-ajax-disabled',
    saveBack: true,
    scrollToTop: true,
    delayContentInsert: true
  };

  function mergeOptions(defaults, settings) {
    return Object.assign({}, defaults, settings);
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function error(msg) {
    console.error("conversion.js: " + msg);
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var EventBus = function () {
    function EventBus() {
      classCallCheck(this, EventBus);

      this.events = {};
    }

    createClass(EventBus, [{
      key: "on",
      value: function on(event, handler) {
        if (isFunction(handler)) {
          this.events[event] = handler;
        } else {
          error("event handler isn't a function");
        }
      }
    }, {
      key: "emit",
      value: function emit(event) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!this.events[event]) {
          return null;
        }

        if (!isFunction(this.events[event])) {
          error("handler for " + event + " event isn't a function");
          return null;
        }

        this.events[event](context);
      }
    }]);
    return EventBus;
  }();

  function request(url, callback, failCallback) {

    var xhttp = new XMLHttpRequest();

    var pageLoaded = function pageLoaded() {
      if (xhttp.status >= 200 && xhttp.status < 400) {

        if (isFunction(callback)) {
          callback(xhttp.responseText, url);
        } else {
          error('callback for request is not a function');
        }
      } else if (xhttp.status == 404) {

        if (isFunction(failCallback)) {
          failCallback(url);
        } else {
          error('fail callback for request is not a function');
        }
      }
    };

    xhttp.addEventListener('load', pageLoaded);

    xhttp.onerror = function () {
      if (isFunction(failCallback)) {
        failCallback(url);
      } else {
        error('fail callback for request is not a function');
      }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
  }

  var Conversion = function () {
    function Conversion(options) {
      classCallCheck(this, Conversion);

      this.options = mergeOptions(defaults, options);
      this.disabled = false;
      this.links = [];
      this.oldLinks = [window.location.href];

      this._eventBus = new EventBus();
      this._isBack = false;
      this._hostName = window.location.hostname;
      this._dom = {};

      this._isDisableAjax = this._isDisableAjax.bind(this);
      this._handleLink = this._handleLink.bind(this);
      this._handleLinkClick = this._handleLinkClick.bind(this);
      this._getContentSuccess = this._getContentSuccess.bind(this);
      this._getContentSuccess = this._getContentSuccess.bind(this);
      this._getContentFail = this._getContentFail.bind(this);
    }

    createClass(Conversion, [{
      key: "init",
      value: function init() {
        this._dom = this._initDom();
        this._initLinks();
        if (this.options.saveBack) this._initWindowPopStateHandler();
        this._eventBus.emit('init.finished');
      }
    }, {
      key: "update",
      value: function update() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.options = mergeOptions(defaults, options);
      }
    }, {
      key: "on",
      value: function on(event, handler) {
        this._eventBus.on(event, handler);
      }
    }, {
      key: "emit",
      value: function emit(event) {
        this._eventBus.emit(event);
      }
    }, {
      key: "disable",
      value: function disable() {
        this.disabled = true;
      }
    }, {
      key: "enable",
      value: function enable() {
        this.disabled = false;
      }
    }, {
      key: "_initDom",
      value: function _initDom() {
        var dom = {};
        dom.body = document.getElementsByTagName('body')[0];
        dom.containerToSearchLinks = document.querySelector(this.options.containerToSearchLinks);
        dom.containerToInsert = document.querySelector(this.options.containerToInsert);
        return dom;
      }
    }, {
      key: "_initLinks",
      value: function _initLinks() {
        this.links = this._dom.containerToSearchLinks.getElementsByTagName('a');
        if (this.links.length <= 0) return null;
        Array.prototype.forEach.call(this.links, this._handleLink);
      }
    }, {
      key: "_initWindowPopStateHandler",
      value: function _initWindowPopStateHandler() {
        var _this = this;

        window.onpopstate = function () {
          if (_this._prevOldLink) {
            _this._isBack = true;
            _this._getContent(_this._prevOldLink);
          }
        };
      }
    }, {
      key: "_isDisableAjax",
      value: function _isDisableAjax(link, url) {
        return url.indexOf('#') >= 0 || url.indexOf(this._hostName) < 0 || link.getAttribute(this.options.disableAttribute);
      }
    }, {
      key: "_handleLink",
      value: function _handleLink(link) {
        var url = link.href;
        if (this._isDisableAjax(link, url)) return null;
        link.addEventListener('click', this._handleLinkClick);
      }
    }, {
      key: "_handleLinkClick",
      value: function _handleLinkClick(e) {
        e.preventDefault();
        var url = e.currentTarget.href;
        if (this._lastOldLink === url) return null;
        this._getContent(url);
      }
    }, {
      key: "_getContent",
      value: function _getContent(url) {
        this._eventBus.emit('request.start');

        request(url, this._getContentSuccess, this._getContentFail);
      }
    }, {
      key: "_getContentSuccess",
      value: function _getContentSuccess(response, url) {
        var _this2 = this;

        this._eventBus.emit('request.success');
        this._eventBus.emit('content.start');

        if (this.options.scrollToTop) {
          window.scrollTo(0, 0);
        }

        if (this.options.delayContentInsert) {
          this._eventBus.on('content.insert', function () {
            _this2._insertContent(response, url);
          });
        } else {
          this._insertContent(response, url);
        }
      }
    }, {
      key: "_insertContent",
      value: function _insertContent(response, url) {
        var fragment = this._getContentFragment(response);
        var responseContainer = fragment.querySelector(this.options.containerToInsert);

        if (!responseContainer) return null;

        this._dom.containerToInsert.innerHTML = responseContainer.innerHTML;

        this._handleBackAction(url);
        this._initLinks();

        this._eventBus.emit('content.inserted', fragment);
      }
    }, {
      key: "_getContentFail",
      value: function _getContentFail() {
        this._eventBus.emit('request.fail');
      }
    }, {
      key: "_getContentFragment",
      value: function _getContentFragment(content) {
        var fragment = document.createElement('html');
        fragment.innerHTML = content;

        return fragment;
      }
    }, {
      key: "_handleBackAction",
      value: function _handleBackAction(url) {
        if (this.options.saveBack) {
          window.history.pushState(null, null, url);
        }

        if (this._isBack) {
          this.oldLinks.pop();
        } else {
          this.oldLinks.push(url);
        }

        this._isBack = false;
      }
    }, {
      key: "_lastOldLink",
      get: function get$$1() {
        return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 1];
      }
    }, {
      key: "_prevOldLink",
      get: function get$$1() {
        return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 2];
      }
    }]);
    return Conversion;
  }();

  return Conversion;

})));
