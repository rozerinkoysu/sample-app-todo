const Component = require("../../app/core/component.js");
const moment = require("../../libs/moment.js")

const TodayBar = function(params) {
  params.textAlignment = SMF.UI.Alignment.CENTER;
  params.borderWidth = 0;
  params.layoutType = SMF.UI.LayoutType.ABSOLUTE;
  
  Component.apply(this, [params]);
  
  var bg = new SMF.UI.Image({
      width: "100%"
    , height: "100%"
    , image: "dashed.png"
    , top: 0
    , left: 0
    , imageFillType: SMF.UI.ImageFillType.TILE
  });
  
  var dayLbl = new SMF.UI.Label({
      text: moment().format('dddd')
    , left: 0
    , top: 0
    , height: "80%"
    , width: "100%"
    , textAlignment: "center"
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

  dayLbl.font.size   = "12pt";
  dayLbl.font.family = "Roboto";
  dayLbl.fontColor   = "#4A4A4A";
  
  this.add(bg);
  this.add(dayLbl);
  this.add(dateLbl);
}

TodayBar.prototype = Object.create(Component.prototype);

module.exports = TodayBar;