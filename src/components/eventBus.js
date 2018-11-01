import {isFunction} from "../utils/type";
import {error} from  "../utils/log";

export default class EventBus {

  constructor() {
    this.events = {};
  }

  on(event, handler) {
    if (isFunction(handler)) {
      this.events[event] = handler;
    } else {
      error("event handler isn't a function");
    }
  }

  emit(event, context = {}) {
    if (!this.events[event]) {
      return null;
    }

    if (!isFunction(this.events[event])) {
      error(`handler for ${event} event isn't a function`);
      return null;
    }

    this.events[event](context);
  }
}