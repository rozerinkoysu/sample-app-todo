const Component = require("../../../app/core/component.js");
const SMFConsole = require("../../../app/core/log.js")

const HeaderBlock = function() {
  Component.call(this
  , {
      left:0
    , top:0
    , width: "100%"
    , height: "31.8%"
    // , layoutType : SMF.UI.LayoutType.FLOW
    , borderWidth : 0
    , horizontalGap: 0
  });
  
  var img = new SMF.UI.Image({
      name: "img"
    , image: "home_back.png"
    , left: 0
    , top: 0
    , width: "100%"
    , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
  });
  
  this.add(img);
  
  // var logo = new SMF.UI.Image({
  //     name: "img"
  //   , image: "log.png"
  //   , width: "100%"
  //   , height: "100%"
  //   , imageFillType: SMF.UI.ImageFillType.NORMAL
  // });
  
  // var logo = new SMF.UI.Image({
  //     name: "header-logo"
  //   , image: "logo.png"
  //   , top: 0
  //   , left:0
  //   , width: "100%"
  //   , height: "100%"
  //   , imageFillType: SMF.UI.ImageFillType.NORMAL
  // });
  
  // logoContainer.add(logo);
  // this.add(logoContainer);
}

HeaderBlock.prototype = Object.create(Component.prototype);

module.exports = HeaderBlock;