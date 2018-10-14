import defaults from './defaults';
import {mergeOptions} from "./utils/object";
import EventBus from "./components/eventBus";

export default class Conversion {
  constructor(options) {
    this.options = mergeOptions(defaults, options);
    this.eventBus = new EventBus();

    this.DOM = {};
    this.DOM.body = document.getElementsByTagName('body')[0];
    this.DOM.containerToInsert = this.DOM.body.querySelector(this.options.containerToInsert);
  }
}