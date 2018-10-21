import defaults from './defaults';
import {mergeOptions} from "./utils/object";
import EventBus from "./components/eventBus";

export default class Conversion {
  constructor(options) {
    this.options = mergeOptions(defaults, options);
    this.eventBus = new EventBus();

    this.disabled = false;
    this.hostName = location.hostname;

    this.links = [];
    this.oldLinks = [];

    this.dom = {};
  }

  init() {
    this.dom = this.initDom();
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

  initDom() {
    let dom = {};
    dom.body = document.getElementsByTagName('body')[0];
    dom.bgBody = document.querySelector('.bg-page');
    dom.header = document.getElementsByTagName('header')[0];
    dom.overlay = this.DOM.body.querySelector(this.options.overlay);
    dom.containerToInsert = this.DOM.body.querySelector(this.options.containerToInsert);
    return dom;
  }
}