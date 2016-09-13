const Component = require("../../../app/core/component.js");
const Rx = require("../../../libs/rx.all.js");

const ChildPageHeader = function(label){
  
  Component.apply(this, [{
      width: "100%"
    , left: 0
    , top: 0
    , height: "11%"
    , fillColor: "#0079B6"
    , roundedEdge: 0
    , backgroundTransparent: false
    , layoutType: SMF.UI.LayoutType.ABSOLUTE
  }]);
  
  const _onTouch$ = new Rx.Subject();
  
  const closeButton = new SMF.UI.Image({
      image: "page_close.png"
    , left: "5%"
    , top: "35%"
    , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
    , onTouch: function(){
      _onTouch$.onNext({type:"close"})
    }
  });
  
  const doneButton = new SMF.UI.Image({
      image: "completed.png"
    , left: "85%"
    , top: "35%"
    , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
    , onTouch: function(){
      _onTouch$.onNext({type:"done"})
    }
  });
  
  const deleteButton = new SMF.UI.Image({
      image: "Delete_detail.png"
    , left: "5%"
    , top: "35%"
    , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
    , onTouch: function(){
      _onTouch$.onNext({type:"delete"});
    }
  });
  
  const title = new SMF.UI.Label({
      text: label
    , fontColor: "#ffffff"
    , width: "100%"
    , height: "100%"
    , left: 0
    , top: 0
    , textAlignment: SMF.UI.TextAlignment.CENTER
    , onTouch: function(){
      _onTouch$.onNext({type:"title"})
    }
  });
  
  this.add(title);
  this.add(doneButton);
  this.add(closeButton);

  this.touched = function(){
    return _onTouch$.share();
  };
};

ChildPageHeader.prototype = Object.create(Component.prototype);

module.exports = ChildPageHeader;