import defaults from './defaults';
import {mergeOptions} from "./utils/object";
import EventBus from "./components/eventBus";
import {request} from "./components/request";

export default class Conversion {
  /**
   * Constructor for Conversion
   *
   * @param {Object} options
   */
  constructor(options) {
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
  init() {
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
  updateLinks() {
    this._initLinks();

    return this;
  }

  /**
   * Update options
   *
   * @param options
   * @returns {Conversion}
   */
  update(options = {}) {
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
  on(event, handler) {
    this._eventBus.on(event, handler);

    return this;
  }

  /**
   * Emit events which run Conversion functional
   *
   * @param {String} event
   * @returns {Conversion}
   */
  emit(event) {
    this._eventBus.emit(event);

    return this;
  }

  /**
   * Disable Conversion (ajax transitions)
   *
   * @returns {Conversion}
   */
  disable() {
    this.disabled = true;

    return this;
  }

  /**
   * Enable Conversion (ajax transitions)
   *
   * @returns {Conversion}
   */
  enable() {
    this.disabled = false;

    return this;
  }

  /**
   * Get DOM elements
   *
   * @returns {Object}
   * @private
   */
  _initDom() {
    let dom = {};
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
  _initLinks() {
    this.links = this._dom.containerToSearchLinks.getElementsByTagName('a');
    if (this.links.length <= 0 ) return null;
    Array.prototype.forEach.call(this.links, this._handleLink);
  }

  /**
   * Set handler for popstate. Browser history
   *
   * @returns {Void}
   * @private
   */
  _initWindowPopStateHandler() {
    window.onpopstate = () => {
      if (this._prevOldLink) {
        this._isBack = true;
        this._getContent(this._prevOldLink);
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
  _isDisableAjax(link, url) {
    return url.indexOf('#') >= 0 ||
      url.indexOf(this._hostName) < 0 ||
      link.hasAttribute(this.options.disableAttribute);
  }

  /**
   * Set a handler for the link
   *
   * @param link
   * @returns {Void}
   * @private
   */
  _handleLink(link) {
    link.addEventListener('click', this._handleLinkClick);
  }

  /**
   * Click executed. User click on the link
   *
   * @param {Event} e
   * @returns {Void}
   * @private
   */
  _handleLinkClick(e) {

    const link = e.currentTarget;
    const url = link.href;

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
  _getContent(url) {
    if (this.options.delayContentInsert) {
      this._eventBus.on('request.activate', () => {
        this._eventBus.emit('request.start');
        request(url, this._getContentSuccess, this._getContentFail);
      })
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
  _getContentSuccess(response, url) {
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
  _insertContent(response, url) {
    this._eventBus.emit('content.insert-started', this._dom.containerToInsert.innerHTML);

    const fragment = this._getContentFragment(response);
    const responseContainer = fragment.querySelector(this.options.containerToInsert);

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
  _getContentFail() {
    this._eventBus.emit('request.fail');
  }

  /**
   * Create fragment with new content
   *
   * @param content
   * @returns {HTMLElement}
   * @private
   */
  _getContentFragment(content) {
    let fragment = document.createElement('html');
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
  _setBackAction(url) {
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
  _bindMethods() {
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
  get _lastOldLink() {
    return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 1];
  }

  /**
   * Gets the previous link from old links
   *
   * @returns {Boolean|String}
   * @private
   */
  get _prevOldLink() {
    return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 2];
  }
}