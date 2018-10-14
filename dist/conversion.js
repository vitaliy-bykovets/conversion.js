(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Conversion = factory());
}(this, (function () { 'use strict';

  var defaults = {
    containerToInsert: '.js-content-insert',
    disableAttribute: 'data-ajax-disabled',
  };

  function mergeOptions (defaults, settings) {
    return Object.assign({}, defaults, settings)
  }

  class Conversion {
    constructor(options) {
      this.options = mergeOptions(defaults, options);

      this.DOM = {};
      this.DOM.body = document.getElementsByTagName('body')[0];
      this.DOM.containerToInsert = this.DOM.body.querySelector(this.options.containerToInsert);
    }
  }

  return Conversion;

})));
