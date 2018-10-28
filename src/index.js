import defaults from './defaults';
import {mergeOptions} from "./utils/object";
import EventBus from "./components/eventBus";
import {request} from "./components/request";

export default class Conversion {
  constructor(options) {
    this.options = mergeOptions(defaults, options);
    this.eventBus = new EventBus();

    this.disabled = false;
    this.links = [];
    this.oldLinks = [];

    this._isBack = false;
    this._hostName = location.hostname;
    this._dom = {};
  }

  init() {
    this._dom = this._initDom();
    this._initLinks();
    this.eventBus.emit('init.finished');
  }

  update(options = {}) {
    this.options = mergeOptions(defaults, options);
  }

  on(event, handler) {
    this.eventBus.on(event, handler);
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
    dom.containerToInsert = dom.body.querySelector(this.options.containerToInsert);
    return dom;
  }

  _initLinks() {
    this.links = this._dom.containerToInsert.getElementsByTagName('a');
    if (this.links.length <= 0 ) return null;
    Array.prototype.forEach.call(this.links, this._handleLink);
  }

  _isDisableAjax(link, url) {
    return url.indexOf('#') >= 0 ||
      url.indexOf(this.hostName) < 0 ||
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
    this._isBack = false;
    this._getContent(url);
  }

  _getContent(url) {
    this.eventBus.emit('request.start');

    request(url, this._getContentSuccess, this._getContentFail);
  }

  _getContentSuccess(response, url) {
    this.eventBus.emit('request.success');

    if (this.options.scrollToTop) {
      window.scrollTo(0, 0);
    }

    let fragment = document.createElement('html');
    fragment.innerHTML = response;

    const responseContainer = fragment.querySelector(this.options.containerToInsert);

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

    this.eventBus.emit('content.inserted');
  }

  _getContentFail() {
    this.eventBus.emit('request.fail');
  }
}