const AbstractContainer = require("./abstract-component.js");

/**
 * Abstract Component Class
 * 
 * @class
 * @abstract
 * @version 1.0.0
 */
const Component = function(params) {
  AbstractContainer.apply(this);
  this._view = new SMF.UI.Container(params);
};

Component.prototype = Object.create(AbstractContainer.prototype);

/**
 * Removes children of the page control
 */
Component.prototype.clear = function() {
  this._view.clear();
};

module.exports = Component;