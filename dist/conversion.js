/**
 * conversion.js v0.0.0
 * Copyright 2018-2018 Vitaliy Bykovets
 * Released under the MIT License
 * https://github.com/vitaliy-bykovets/conversion.js
 **/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.conversion = global.conversion || {}, global.conversion.js = factory());
}(this, (function () { 'use strict';

  var defaults = {
    /**
     * Class for container where to insert container.
     * This class also is used for searching new content in the response.
     *
     * @type {String}
     */
    containerToInsert: '.js-content-insert',

    /**
     * A container where to search links
     *
     * @type {String}
     */
    containerToSearchLinks: 'body',

    /**
     * An attribute for disabling ajax request
     *
     * @type {String}
     */
    disableAttribute: 'data-ajax-disabled',

    /**
     * Handle browser history.
     * Run a request when user click Back button
     *
     * @type {Boolean}
     */
    saveBack: true,

    /**
     * Scroll a page to top after a request
     *
     * @type {Boolean}
     */
    scrollToTop: true,

    /**
     * If a content should be inserted with delay.
     * In this case content should be inserting using .emit('request.activate')
     *
     * @type {Boolean}
     */
    delayContentInsert: false
  };

  /**
   * Merge options
   *
   * @param {Object} defaults
   * @param {Object} settings
   * @returns {Object}
   */
  function mergeOptions(defaults, settings) {
    return Object.assign({}, defaults, settings);
  }

  /**
   * Check if value is function
   *
   * @param value
   * @returns {boolean}
   */
  function isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * Output error message
   *
   * @param {String} msg
   */
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

  /**
   * Bus for event handlers
   */

  var EventBus = function () {

      /**
      * Constructor for EventBus
      */
      function EventBus() {
          classCallCheck(this, EventBus);

          this.events = {};
      }

      /**
      * Add event listener
      *
      * @param event
      * @param handler
      * @returns {Void}
      */


      createClass(EventBus, [{
          key: 'on',
          value: function on(event, handler) {
              if (isFunction(handler)) {
                  this.events[event] = handler;
              } else {
                  error('event handler isn\'t a function');
              }
          }

          /**
          * Emit event
          *
          * @param event
          * @param context
          * @returns {Void}
          */

      }, {
          key: 'emit',
          value: function emit(event) {
              var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

              if (!this.events[event]) {
                  return null;
              }

              if (!isFunction(this.events[event])) {
                  error('handler for ' + event + ' event isn\'t a function');
                  return null;
              }

              this.events[event](context);
          }
      }]);
      return EventBus;
  }();

  /**
   * XMLHttpRequest
   *
   * @param {String} url
   * @param {Function} callback
   * @param {Function} failCallback
   * @returns {Void}
   */
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

      xhttp.open('GET', url, true);
      xhttp.send();
  }

  var Conversion = function () {
    /**
     * Constructor for Conversion
     *
     * @param {Object} options
     */
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
    }

    /**
     * Initialize Conversion
     *
     * @return {Conversion}
     */


    createClass(Conversion, [{
      key: "init",
      value: function init() {
        this._eventBus.emit('init.started');
        this._bindMethods();
        this._dom = this._initDom();
        this._initLinks();
        if (this.options.saveBack) this._initWindowPopStateHandler();
        this._eventBus.emit('init.finished');

        return this;
      }

      /**
       * Update link handlers
       *
       * @return {Conversion}
       */

    }, {
      key: "updateLinks",
      value: function updateLinks() {
        this._initLinks();

        return this;
      }

      /**
       * Update options
       *
       * @param options
       * @returns {Conversion}
       */

    }, {
      key: "update",
      value: function update() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.options = mergeOptions(defaults, options);

        return this;
      }

      /**
       * Add event listener with callback
       *
       * @param {String} event
       * @param {Function} handler
       * @returns {Conversion}
       */

    }, {
      key: "on",
      value: function on(event, handler) {
        this._eventBus.on(event, handler);

        return this;
      }

      /**
       * Emit events which run Conversion functional
       *
       * @param {String} event
       * @returns {Conversion}
       */

    }, {
      key: "emit",
      value: function emit(event) {
        this._eventBus.emit(event);

        return this;
      }

      /**
       * Disable Conversion (ajax transitions)
       *
       * @returns {Conversion}
       */

    }, {
      key: "disable",
      value: function disable() {
        this.disabled = true;

        return this;
      }

      /**
       * Enable Conversion (ajax transitions)
       *
       * @returns {Conversion}
       */

    }, {
      key: "enable",
      value: function enable() {
        this.disabled = false;

        return this;
      }

      /**
       * Get DOM elements
       *
       * @returns {Object}
       * @private
       */

    }, {
      key: "_initDom",
      value: function _initDom() {
        var dom = {};
        dom.containerToSearchLinks = document.querySelector(this.options.containerToSearchLinks);
        dom.containerToInsert = document.querySelector(this.options.containerToInsert);
        return dom;
      }

      /**
       * Get links and set handlers
       *
       * @returns {Void}
       * @private
       */

    }, {
      key: "_initLinks",
      value: function _initLinks() {
        this.links = this._dom.containerToSearchLinks.getElementsByTagName('a');
        if (this.links.length <= 0) return null;
        Array.prototype.forEach.call(this.links, this._handleLink);
      }

      /**
       * Set handler for popstate. Browser history
       *
       * @returns {Void}
       * @private
       */

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

      /**
       * Check if ajax is disabled for link
       *
       * @param link
       * @param url
       * @returns {boolean}
       * @private
       */

    }, {
      key: "_isDisableAjax",
      value: function _isDisableAjax(link, url) {
        return url.indexOf('#') >= 0 || url.indexOf(this._hostName) < 0 || link.hasAttribute(this.options.disableAttribute);
      }

      /**
       * Set a handler for the link
       *
       * @param link
       * @returns {Void}
       * @private
       */

    }, {
      key: "_handleLink",
      value: function _handleLink(link) {
        link.addEventListener('click', this._handleLinkClick);
      }

      /**
       * Click executed. User click on the link
       *
       * @param {Event} e
       * @returns {Void}
       * @private
       */

    }, {
      key: "_handleLinkClick",
      value: function _handleLinkClick(e) {

        var link = e.currentTarget;
        var url = link.href;

        if (this._isDisableAjax(link, url)) return null;
        if (this._lastOldLink === url) return null;
        if (this.disabled) return null;

        e.preventDefault();
        this._getContent(url);
        this._eventBus.emit('click.executed');
      }

      /**
       * Start to start request
       *
       * @param {String} url
       * @returns {Void}
       * @private
       */

    }, {
      key: "_getContent",
      value: function _getContent(url) {
        var _this2 = this;

        if (this.options.delayContentInsert) {
          this._eventBus.on('request.activate', function () {
            _this2._eventBus.emit('request.start');
            request(url, _this2._getContentSuccess, _this2._getContentFail);
          });
        } else {
          this._eventBus.emit('request.start');
          request(url, this._getContentSuccess, this._getContentFail);
        }
      }

      /**
       * Request is successful
       *
       * @param {String} response
       * @param {String} url
       * @returns {Void}
       * @private
       */

    }, {
      key: "_getContentSuccess",
      value: function _getContentSuccess(response, url) {
        this._eventBus.emit('request.success');

        if (this.options.scrollToTop) {
          window.scrollTo(0, 0);
        }

        this._insertContent(response, url);
      }

      /**
       * Insert new content
       *
       * @param {String} response
       * @param {String} url
       * @returns {Void}
       * @private
       */

    }, {
      key: "_insertContent",
      value: function _insertContent(response, url) {
        this._eventBus.emit('content.insert-started', this._dom.containerToInsert.innerHTML);

        var fragment = this._getContentFragment(response);
        var responseContainer = fragment.querySelector(this.options.containerToInsert);

        if (!responseContainer) return null;

        this._dom.containerToInsert.innerHTML = responseContainer.innerHTML;

        this._setBackAction(url);
        this._initLinks();

        this._eventBus.emit('content.inserted', fragment);
      }

      /**
       * Request is failed
       *
       * @returns {Void}
       * @private
       */

    }, {
      key: "_getContentFail",
      value: function _getContentFail() {
        this._eventBus.emit('request.fail');
      }

      /**
       * Create fragment with new content
       *
       * @param content
       * @returns {HTMLElement}
       * @private
       */

    }, {
      key: "_getContentFragment",
      value: function _getContentFragment(content) {
        var fragment = document.createElement('html');
        fragment.innerHTML = content;

        return fragment;
      }

      /**
       * Set url to browser history
       * Save url to old array.
       *
       * @param url
       * @returns {Void}
       * @private
       */

    }, {
      key: "_setBackAction",
      value: function _setBackAction(url) {
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

      /**
       * Bind Conversion context to methods
       *
       * @returns {Void}
       * @private
       */

    }, {
      key: "_bindMethods",
      value: function _bindMethods() {
        this._isDisableAjax = this._isDisableAjax.bind(this);
        this._handleLink = this._handleLink.bind(this);
        this._handleLinkClick = this._handleLinkClick.bind(this);
        this._getContentSuccess = this._getContentSuccess.bind(this);
        this._getContentSuccess = this._getContentSuccess.bind(this);
        this._getContentFail = this._getContentFail.bind(this);
      }

      /**
       * Gets the last link from old links
       *
       * @returns {Boolean|String}
       * @private
       */

    }, {
      key: "_lastOldLink",
      get: function get$$1() {
        return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 1];
      }

      /**
       * Gets the previous link from old links
       *
       * @returns {Boolean|String}
       * @private
       */

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
