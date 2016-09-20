const TodayBar  = require("./today-bar.js");
const Component = require("../../app/core/component.js");
const moment    = require("../../libs/moment.js");

const TodoDetailInfoBar = function(params){
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
      left: 0
    , top: 0
    , height: "80%"
    , width: "100%"
    , textAlignment: "center"
  });

  var dateLbl = new SMF.UI.Label({
      left: 0
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
  
  const dayContainer = new SMF.UI.Container({
      width: "65%"
    , height: "100%"
    , top: "0"
    , left: "35%"
    , borderWidth: 0
    , layoutType: SMF.UI.LayoutType.ABSOLUTE
  })

  this.add(bg);
  dayContainer.add(dayLbl);
  dayContainer.add(dateLbl);
  
  const vSep = new SMF.UI.Rectangle({
      width: 1
    , height: "100%"
    , top: 0
    , left: "35%"
    , borderColor: "#979797"
  })

  const hSep = new SMF.UI.Rectangle({
      width: "100%"
    , height: "1"
    , top: "99%"
    , left: 0
    , borderColor: "#979797"
  })
  
  this.add(vSep);
  this.add(hSep);

  const iconContainer = new SMF.UI.Container({
      width: "35%"
    , height: "100%"
    , borderWidth: 0
    , top: 0
    , left: 0
    , layoutType: SMF.UI.LayoutType.ABSOLUTE
  });
  
  const typeText  = new SMF.UI.Label({
      width: "80%"
    , height: "40%"
    , top: "50%"
    , textAlignment: SMF.UI.TextAlignment.CENTER
  });
  
  typeText.font.size   = "6pt";
  typeText.font.family = "Roboto";
  
  const typeIcon = new SMF.UI.Image({
      width: "100%"
    , height: "90%"
    , left: 0
    , top: 0
    // , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
  });
  
  iconContainer.add(typeText);
  iconContainer.add(typeIcon);
  
  this.setProps = function(image, type, date){
    typeIcon.image = image;
    typeText.text  = type;
    dayLbl.text    = moment(date).format('dddd');
    dateLbl.text   = moment(date).format('LL');
  };
  
  this.add(iconContainer);
  this.add(dayContainer);
};

TodoDetailInfoBar.prototype = Object.create(Component.prototype);

module.exports = TodoDetailInfoBar;