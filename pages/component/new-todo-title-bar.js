const Component = require("../../app/core/component.js");
const moment = require("../../libs/moment.js");

const NewTodoTitleBar = function(params) {
  params.borderWidth = 0;
  params.layoutType = SMF.UI.LayoutType.ABSOLUTE;
  
  Component.apply(this, [params]);
  
  var bg = new SMF.UI.Image({
      width: "100%"
    , height: "100%"
    , image: "dashed.png"
    , top: 0
    , left: 0
    , imageFillType: SMF.UI.ImageFillType.ASPECTFIT
  });
  
  var titleLbl = new SMF.UI.Label({
      text: ""
    , left: 0
    , top: 0
    , height: "80%"
    , width: "100%"
    , textAlignment: SMF.UI.TextAlignment.CENTER
  });

  var dateLbl = new SMF.UI.Label({
      text: moment().format('LL')
    , left: 0
    , top: "25%"
    , height: "100%"
    , width: "100%"
    , textAlignment: "center"
  });
  
  dateLbl.font.size   = "6pt";
  dateLbl.font.family = "Roboto";
  dateLbl.fontColor   = "#9E9E9E";

  titleLbl.font.size   = "12pt";
  titleLbl.font.family = "Roboto";
  titleLbl.fontColor   = "#4A4A4A";
  
  this.add(bg);
  this.add(titleLbl);
  this.add(dateLbl);
  
  this.setTitle = function(text){
    titleLbl.text = text;
  };
};

NewTodoTitleBar.prototype = Object.create(Component.prototype);

module.exports = NewTodoTitleBar;