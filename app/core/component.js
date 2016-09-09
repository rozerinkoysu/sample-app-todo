const AbstractComponent = require("./abstract-component.js");
const SMFConsole = require("./log.js");

const Component = function(params) {
  AbstractComponent.apply(this);
  this._view = new SMF.UI.Container(params);
};

Component.prototype = Object.create(AbstractComponent.prototype);

// Component.prototype.add = ComponentMixin.addChild;

Component.prototype.clear = function() {
  this._view.clear();
};

module.exports = Component;