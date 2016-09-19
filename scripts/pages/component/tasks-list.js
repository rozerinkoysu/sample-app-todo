const Component         = require("../../app/core/component.js");
const TodoAssetsService = require("../../app/domain/todo-assets-service.js");
const TodoStore         = require("../../app/domain/todo-store.js");
const SMFConsole        = require("../../app/core/log.js");
const Router            = require("../../app/core/router.js");
const TodoService       = require("../../app/domain/todo-service.js");

/*
const createSwipeRect = function(props){
  if(Device.deviceOS == "iOS"){
    return new SMF.UI.RepeatBoxSwipeItem(props);
  } else {
    return new SMF.UI.Rectangle(props);
  }
};

const createSwipeImage = function(props){
  if(Device.deviceOS == "iOS"){
    return new SMF.UI.RepeatBoxSwipeItem(props);
  } else {
    return new SMF.UI.Image(props);
  }
};
*/
const TasksList = function(params){
  Component.apply(this, [params]);
  var _tasks;
  
  const rBox = new SMF.UI.RepeatBox(
    Object.assign({
        left: 0
      , top: 0
      , width: "100%"
      , height: "100%"
      , showScrollbar: true
      , fillColor: "#f2f2f2"
      // , deleteAnimationType: SMF.UI.RepeatBoxRowAnimation.TOP
      , allowDeletingItems: true
      , onSelectedItem: function(e){
        // SMFConsole.dir(e);
        // console.log("on selected : "+e.rowIndex+_tasks[e.rowIndex]);
        Router.go("todo/detail", {id: _tasks[e.rowIndex]}.id);
      }
    }
    , params
  ));
  
  const repeatBoxRowTodoSummary = new SMF.UI.Label({
      top: 0
    , left: "22%"
    , width: "100%"
    , height: "100%"
    , fontColor: "#009DEB"
    // , textAlignment: SMF.UI.TextAlignment.LEFT
    , touchEnabled: false // Only for Android, it should be false.
  });
  
  repeatBoxRowTodoSummary.font.size = "8pt";
  repeatBoxRowTodoSummary.font.family = "Roboto";
  
  const repeatBoxRowTodoIcon = new SMF.UI.Image({
      width: "20%"
    , height: "100%"
    , left: "0"
    , top: 0
  });
  
  const alarmIcon = new SMF.UI.Image({
      height: "15%"
    , width: "10%"
    , image: "bell.png"
    , left: "22%"
    , top: "75%"
    , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
  });
  
  const alarmText = new SMF.UI.Label({
      top: "75%"
    , left: "29%"
    // , width: "100%"
    , height: "16%"
    , fontColor: "#4A4A4A"
    , touchEnabled: false // Only for Android, it should be false.
  });

  alarmText.font.size = "6pt";
  alarmText.font.family = "Roboto";
  
  
  // const deleteRowAnimation = function(rowIndex, onComplete){
    // var height = rBox.rows[rowIndex].height;
    // var t = 0.2;
    // onComplete();
    // const interval = setInterval(function(){
    //   rBox.rows[rowIndex].height = rBox.rows[rowIndex].height - t * t;
    //   t += 0.2;
    //   rBox.refresh();
    //   if(rBox.rows[rowIndex].height < 10){
    //     rBox.rows[rowIndex].height = height;
    //     clearInterval(interval);
    //     onComplete();
    //   }
    // }, 10);
  // }
  
  // var taskDelete = createSwipeImage({
  //     width: 100
  //   , height: "100%"
  //   , left: Device.screenWidth - 100
  //   , top: 0
  //   , defaultImage: "delete.png"
  //   , highlightedImage: "delete.png"
  //   , fillColor: "#ff0000"
  //   , onSelected: function (e) {
  //     deleteRowAnimation(e.rowIndex, function(){
  //       TodoStore.deleteTask(_tasks[e.rowIndex].id);
  //     });
  //   }
  // });

  // var taskDeleteBg = createSwipeRect({
  //     width: 100
  //   , height: "100%"
  //   , left: Device.screenWidth - 100
  //   , top: 0
  //   , text: " "
  //   , fillColor: "#D0021B"
  // });

  // var taskCompleted = createSwipeImage({
  //     width: 100
  //   , height: "100%"
  //   , left: Device.screenWidth - 200
  //   , top: 0
  //   , defaultImage: "completed.png"
  //   , highlightedImage: "completed.png"
  //   , onSelected : function (e) {
  //     deleteRowAnimation(e.rowIndex, function(){
  //       TodoStore.completeTask(_tasks[e.rowIndex].id);
  //     });
  //   }
  // });

  // var taskCompletedBg = createSwipeRect({
  //     width: 100
  //   , height: "100%"
  //   , left: Device.screenWidth - 200
  //   , top: 0
  //   , text: " "
  //   , fillColor: "#7ED321"
  // });
  
  rBox.itemTemplate.add(repeatBoxRowTodoIcon);
  rBox.itemTemplate.add(repeatBoxRowTodoSummary);
  rBox.itemTemplate.add(alarmIcon);
  rBox.itemTemplate.add(alarmText);
  
  rBox.itemTemplate.height = Device.screenHeight / 7;
  // rBox.itemTemplate.imageFillType = SMF.UI.ImageFillType.STRETCH;
  // if(Device.deviceOS == "iOS") {
    // rBox.setSwipeItems([taskDelete, taskCompleted, taskDeleteBg, taskCompletedBg]);
  // }
  
  this._view = rBox;

  this.setTasks = function(tasks, state){
    _tasks = tasks;
    rBox.dataSource = tasks;

    rBox.onRowRender = function (e) {
      function makeShorter(summary){
        return (summary.length > 29) ? summary.substring(0, 26)+"..." : summary;
      }
      
      this.controls[0].image = TodoAssetsService.getIcon(tasks[e.rowIndex].type, TodoAssetsService.types.black);
      this.controls[1].text  = makeShorter(tasks[e.rowIndex].summary);
      
      if(tasks[e.rowIndex].isAlarmSet) {
        this.controls[2].visible = true;
        this.controls[3].text  = TodoService.dateToCalendarText(tasks[e.rowIndex].alarmRule);
      } else {
        this.controls[2].visible = false;
        this.controls[3].text = "";
      }
    };
  };
};

TasksList.prototype = Object.create(Component.prototype);

module.exports = TasksList;