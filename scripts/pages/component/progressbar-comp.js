/*
  ProgressBar component
*/

const Component = require('../../app/core/component.js');
const TodoAssetsService = require("../../app/domain/todo-assets-service.js");

const TaskProgressBarComp = function(type, tasks) {
  
  Component.apply(this, [{
      width: '98%'
    , height: "16%"
    , left: 0
    , layoutType: SMF.UI.LayoutType.ABSOLUTE
    // , layoutAlignment: SMF.UI.LayoutAlignment.CENTER
    , verticalGap: 0
    , horizontalGap: 0
    , borderWidth: 0
  }]);
  
  const icon = new SMF.UI.Image({
      left: 0
    , top: 0
    , width: "20%"
    , height: "100%"
    , image: TodoAssetsService.getIcon(type, TodoAssetsService.types.white)
  });
  
  this.add(icon);
  
  const progressbarRect = new SMF.UI.Rectangle({
      top: "12%"
    , left: "1%"  
    , width: "40%"
    , height: "80%"
    , fillColor: "#7ED321"
    , roundedEdge: 0
  });

  var progressbarBackground = new SMF.UI.Rectangle({
      top: 0
    , left: "0"
    , width: "100%"
    , height: "100%"
    , fillColor: "#000000"
    , alpha: 0.1
    , roundedEdge: 0
  });
    
  var barContainer = new SMF.UI.Container({
      top: "37.5%"
    , width: "60%"
    , height: "25%"
    , left: "25%"
    , borderWidth: "1.5%"
    , borderColor: "#305E75"
    , roundedEdge: 0
  });
  
  barContainer.add(progressbarBackground);
  barContainer.add(progressbarRect);
  this.add(barContainer);
  
  var curentWidth = 0;
  progressbarRect.width = curentWidth;
  
  this.setProps = function(current, max) {
    // updates progressbar width
    curentWidth = ((current * 98) / max )+"%";
  };

  this._view.onShow = function() {
    // this.animate();
  };
  
  this.animate = function() {
    progressbarRect.width = 1;
    progressbarRect.animate({
      property: 'width',
      endValue: curentWidth,
      motionEase: SMF.UI.MotionEase.DECELERATING,
      duration: 300,
      onFinish: function() {
      }
    });
  };
};

TaskProgressBarComp.prototype = Object.create(Component.prototype);

module.exports = TaskProgressBarComp;