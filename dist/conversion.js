(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Conversion = factory());
}(this, (function () { 'use strict';

  var defaults = {
    containerToInsert: '.js-content-insert',
    disableAttribute: 'data-ajax-disabled',
    scrollToTop: true
  };

  function mergeOptions(defaults, settings) {
    return Object.assign({}, defaults, settings);
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  function error(msg) {
    console.error("Conversion: " + msg);
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
        this.events[event]();
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
      this.eventBus = new EventBus();

      this.disabled = false;
      this.links = [];
      this.oldLinks = [];

      this._isBack = false;
      this._hostName = location.hostname;
      this._dom = {};
    }

    createClass(Conversion, [{
      key: "init",
      value: function init() {
        this._dom = this._initDom();
        this._initLinks();
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
        this.eventBus.on(event, handler);
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
        dom.containerToInsert = dom.body.querySelector(this.options.containerToInsert);
        return dom;
      }
    }, {
      key: "_initLinks",
      value: function _initLinks() {
        this.links = this._dom.containerToInsert.getElementsByTagName('a');
        if (this.links.length <= 0) return null;
        Array.prototype.forEach.call(this.links, this._handleLink);
      }
    }, {
      key: "_isDisableAjax",
      value: function _isDisableAjax(link, url) {
        return url.indexOf('#') >= 0 || url.indexOf(this.hostName) < 0 || link.getAttribute(this.options.disableAttribute);
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
        this._isBack = false;
        this._getContent(url);
      }
    }, {
      key: "_getContent",
      value: function _getContent(url) {
        // TODO emit event request.start

        request(url, this._getContentSuccess, this._getContentFail);
      }
    }, {
      key: "_getContentSuccess",
      value: function _getContentSuccess(response, url) {
        // TODO emit event request.success with data - response

        if (this.options.scrollToTop) {
          window.scrollTo(0, 0);
        }

        var fragment = document.createElement('html');
        fragment.innerHTML = response;

        var responseContainer = fragment.querySelector(this.options.containerToInsert);

        if (!responseContainer) return null;

        this.DOM.containerToInsert.innerHTML = responseContainer.innerHTML;

        this.DOM.body.classList = responseBody.classList; // set body classes

        if (this._isBack) {
          this.oldLinks.pop();
        } else {
          this.oldLinks.push(window.location.href);
        }

        window.history.pushState(null, null, url);
        this._initLinks(); // reinit all links

        // TODO emit event content:inserted
      }
    }, {
      key: "_getContentFail",
      value: function _getContentFail() {
        // TODO emit event request.fail
      }
    }]);
    return Conversion;
  }();

  return Conversion;

})));
