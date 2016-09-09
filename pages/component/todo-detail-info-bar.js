const TodayBar = require("./today-bar.js");
const Component = require("../../app/core/component.js");

const TodoDetailInfoBar = function(params){
  Component.apply(this, [params]);
  
  const todayBar = new TodayBar({
      width: "80%"
    , height: "100%"
  });
  
  const typeIcon = new SMF.UI.Image({
      width: "20%"
    , height: "100%"
  });
  
  this.add(typeIcon);
  this.add(todayBar);
};

TodayBar.prototype = Object.create(Component.prototype);