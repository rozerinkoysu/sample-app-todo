const Component = require("../../../app/core/component.js");
// const SMFConsole = require("../../../app/core/log.js")

const HeaderBlock = function() {
  Component.call(this
  , {
      left:0
    , top:0
    , width: "100%"
    , height: "32.3%"
    // , layoutType : SMF.UI.LayoutType.FLOW
    , borderWidth : 0
    , horizontalGap: 0
  });
  
  var img = new SMF.UI.Image({
      name: "img"
    , image: "home_back.png"
    , left: 0
    , top: 0
    , height: "100%"
    , width: "100%"
    , imageFillType: SMF.UI.ImageFillType.STRETCH
  });
  
  this.add(img);
};

HeaderBlock.prototype = Object.create(Component.prototype);

module.exports = HeaderBlock;