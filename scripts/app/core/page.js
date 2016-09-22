const SMFConsole = require("./log.js");
const Component  = require("./component.js");
const AbstractContainer = require("./abstract-component.js");

/**
 * @class PageBase
 * @abstract
 * @version 1.0.0
 * 
 * Abstract Native Page Control Wrapping CLass
 */
var PageBase = function(params) {
  AbstractContainer.call(this);
  /**
   * @property _view
   * @private
   * 
   * Create new native Page Control
   */
  this._view = new SMF.UI.Page(params);
};

PageBase.prototype = Object.create(AbstractContainer.prototype);

/**
 * Returns background url of native page
 * 
 * @returns {string}
 */
PageBase.prototype.getBackgroundImage = function() {
  return this._view.backgroundImage;
};

/**
 * Sets the page control background image url
 *
 * @param {string} url Image url
 */
PageBase.prototype.setBackgroundImage = function(url) {
  return this._view.backgroundImage = url;
};

/**
 * Returns children components of the page control
 *
 * @returns {Array}
 */
PageBase.prototype.getControls = function() {
  return this._view.controls;
};

/**
 * Returns enabled value of the page control
 *
 * @returns {boolean} [true]
 */
PageBase.prototype.getEnabled = function() {
  return this._view.enabled;
};

/**
 * Sets enabled value of the page control
 * 
 * @param {boolean} value
 */
PageBase.prototype.setEnabled = function(value) {
  this._view.enabled = value;
};

/**
 * @abstract
 * 
 * Injects rouing data to component
 */
PageBase.prototype.setRouteParams = function() {
};

/**
 * Sets any property of the page control
 * 
 * @returns {PageBase}
 */
PageBase.prototype.setProp = function(prop, value) {
  this._view["prop"] = value;
  
  return this;
};

/**
 * Returns the page control propperty value by specified prop name 
 * 
 * @returns {}
 */
PageBase.prototype.getProp = function(prop) {
  return this._view["prop"];
};

/**
 * Calls native Page Control's show method
 * Please look at the Native Page Control api docs
 * Can be Injected any params as same as Native Page Control show method
 * 
 * @returns {PageBase}
 */
PageBase.prototype.show = function() {
  // converts function arguments to array
  var args = Array
    .prototype
    .slice
    .call(arguments);
    
  this
    ._view
    .show
    .apply(this._view, args);
    
  return this;
};

module.exports = PageBase;