const SMFConsole = require("./log.js");

/**
 * @class
 * @version 1.0.0
 * 
 * Abstract Container Class
 */
const AbstractContainer = function(){
};

/**
 * Adds child element to view
 */
AbstractContainer.prototype.add = function(child) {
  try {
    if (child instanceof AbstractContainer) {
      this._view.add(child._view);
    } else {
      this._view.add(child);
    }
  } catch(e) {
    SMFConsole.error('[AbstractContainer.add]', this, child, e);
  }
};

/**
 * Returns view control width
 *
 * @returns {(number|string)}
 */
AbstractContainer.prototype.getWidth = function () {
  return this._view.width;
}

/**
 * Sets view control width
 */
AbstractContainer.prototype.setWidth = function (value) {
  this._view.width.width = value;
}

/**
 * Returns view control width
 *
 * @returns {(number|string)}
 */
AbstractContainer.prototype.getHeight = function () {
  return this._view.height;
}

/**
 * Sets view control height
 */
AbstractContainer.prototype.setHeight = function (value) {
  this._view.width.height = value;
}



module.exports = AbstractContainer;