import {isFunction} from '../utils/type';
import {error} from  '../utils/log';

/**
 * Bus for event handlers
 */
export default class EventBus {

    /**
   * Constructor for EventBus
   */
    constructor() {
        this.events = {};
    }

    /**
   * Add event listener
   *
   * @param event
   * @param handler
   * @returns {Void}
   */
    on(event, handler) {
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