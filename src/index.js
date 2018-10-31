import defaults from './defaults';
import {mergeOptions} from "./utils/object";
import EventBus from "./components/eventBus";
import {request} from "./components/request";

export default class Conversion {
  constructor(options) {
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

  init() {
    this._dom = this._initDom();
    this._initLinks();
    if (this.options.saveBack) this._initWindowPopStateHandler();
    this._eventBus.emit('init.finished');
  }

  update(options = {}) {
    this.options = mergeOptions(defaults, options);
  }

  on(event, handler) {
    this._eventBus.on(event, handler);
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  _initDom() {
    let dom = {};
    dom.body = document.getElementsByTagName('body')[0];
    dom.containerToSearchLinks = document.querySelector(this.options.containerToSearchLinks);
    dom.containerToInsert = document.querySelector(this.options.containerToInsert);
    return dom;
  }

  _initLinks() {
    this.links = this._dom.containerToSearchLinks.getElementsByTagName('a');
    if (this.links.length <= 0 ) return null;
    Array.prototype.forEach.call(this.links, this._handleLink);
  }

  _initWindowPopStateHandler() {
    window.onpopstate = () => {
      if (this._prevOldLink) {
        this._isBack = true;
        this._getContent(this._prevOldLink);
      }
    };
  }

  _isDisableAjax(link, url) {
    return url.indexOf('#') >= 0 ||
      url.indexOf(this._hostName) < 0 ||
      link.getAttribute(this.options.disableAttribute);
  }

  _handleLink(link) {
    const url = link.href;
    if (this._isDisableAjax(link, url)) return null;
    link.addEventListener('click', this._handleLinkClick);
  }

  _handleLinkClick(e) {
    e.preventDefault();
    const url = e.currentTarget.href;
    if (this._lastOldLink === url) return null;
    this._getContent(url);
  }

  _getContent(url) {
    this._eventBus.emit('request.start');

    request(url, this._getContentSuccess, this._getContentFail);
  }

  _getContentSuccess(response, url) {
    this._eventBus.emit('request.success');
    this._eventBus.emit('content.start');

    if (this.options.scrollToTop) {
      window.scrollTo(0, 0);
    }

    const responseContainer = this._getContentFragment(response);
    if (!responseContainer) return null;

    this._dom.containerToInsert.innerHTML = responseContainer.innerHTML;

    if (this.options.saveBack) {
      window.history.pushState(null, null, url);
    }

    if (this._isBack) {
      this.oldLinks.pop();
    } else {
      this.oldLinks.push(url);
    }

    this._initLinks();
    this._eventBus.emit('content.inserted');
    this._isBack = false;
  }

  _getContentFail() {
    this._eventBus.emit('request.fail');
  }

  _getContentFragment(content) {
    let fragment = document.createElement('html');
    fragment.innerHTML = content;

    return fragment.querySelector(this.options.containerToInsert);
  }

  get _lastOldLink() {
    return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 1];
  }

  get _prevOldLink() {
    return this.oldLinks.length > 0 && this.oldLinks[this.oldLinks.length - 2];
  }
}