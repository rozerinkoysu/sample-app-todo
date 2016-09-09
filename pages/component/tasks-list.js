const Component         = require("../../app/core/component.js");
const TodoAssetsService = require("../../app/domain/todo-assets-service.js");
const TodoStore         = require("../../app/domain/todo-store.js");
const SMFConsole        = require("../../app/core/log.js");

const createSwipeRect = function(props){
  if(Device.deviceOS == "iOS"){
    return new SMF.UI.RepeatBoxSwipeItem(props);
  } else {
    return new SMF.UI.Rectangle(props);
  }
}

const createSwipeImage = function(props){
  if(Device.deviceOS == "iOS"){
    return new SMF.UI.RepeatBoxSwipeItem(props);
  } else {
    return new SMF.UI.Image(props)
  }
}

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
      , deleteAnimationType: SMF.UI.RepeatBoxRowAnimation.TOP
      , allowDeletingItems: true
    }
    , params
  ));
  
  const lbl = new SMF.UI.Label({
      top: 0
    , left: "22%"
    , width: "100%"
    , height: "100%"
    , fontColor: "#009DEB"
    , font: { size: "12pt"}
    , textAlignment: SMF.UI.TextAlignment.LEFT
    , touchEnabled: false // Only for Android, it should be false.
  });
  
  const icon = new SMF.UI.Image({
      width: "75%"
    , height: "75%"
    , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
    , left: "5%"
  });
  
  const deleteRowAnimation = function(rowIndex, onComplete){
    var height = rBox.rows[rowIndex].height;
    var t = 0.2;
    onComplete();
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
  }
  
  var taskDelete = createSwipeImage({
      width: 100
    , height: "100%"
    , left: Device.screenWidth - 100
    , top: 0
    , defaultImage: "delete.png"
    , highlightedImage: "delete.png"
    , fillColor: "#ff0000"
    , onSelected: function (e) {
      deleteRowAnimation(e.rowIndex, function(){
        TodoStore.deleteTask(_tasks[e.rowIndex].id);
      });
        // SMFConsole.dir("delete click!!!", e);
        // rBox.rows[e.rowIndex].allowDeletingItem = true;
        // rBox.rows[e.rowIndex].onControlRemoved = function( e ){
        //   SMFConsole.dir("row removed!!!", e);
        // };
        
        // rBox.deleteRow(e.rowIndex);
        // rBox.refresh(e.rowIndex);
        // TodoStore.deleteTask(_tasks[e.rowIndex].id);
    }
  });

  var taskDeleteBg = createSwipeRect({
      width: 100
    , height: "100%"
    , left: Device.screenWidth - 100
    , top: 0
    , text: " "
    , fillColor: "#D0021B"
  });

  var taskCompleted = createSwipeImage({
      width: 100
    , height: "100%"
    , left: Device.screenWidth - 200
    , top: 0
    , defaultImage: "completed.png"
    , highlightedImage: "completed.png"
    , onSelected : function (e) {
      SMFConsole.dir("complete click!!!");
      deleteRowAnimation(e.rowIndex, function(){
        SMFConsole.log("task remove Completed");
        TodoStore.completeTask(_tasks[e.rowIndex].id);
      });
    }
  });

  var taskCompletedBg = createSwipeRect({
      width: 100
    , height: "100%"
    , left: Device.screenWidth - 200
    , top: 0
    , text: " "
    , fillColor: "#7ED321"
  });
  
  rBox.itemTemplate.add(icon);
  rBox.itemTemplate.add(lbl);
  
  rBox.itemTemplate.height = Device.screenHeight / 7;
  // rBox.itemTemplate.imageFillType = SMF.UI.ImageFillType.STRETCH;
  if(Device.deviceOS == "iOS") {
    rBox.setSwipeItems([taskDelete, taskCompleted, taskDeleteBg, taskCompletedBg]);
  }
  
  this._view = rBox;

  this.setTasks = function(tasks, state){
    _tasks = tasks;
    rBox.dataSource = tasks;

    rBox.onRowRender = function (e) {
      SMFConsole.dir(e);
      this.controls[0].image = TodoAssetsService.getIcon(tasks[e.rowIndex].type, TodoAssetsService.types.black);
      this.controls[1].text = tasks[e.rowIndex].summary;
    };
  };
};

TasksList.prototype = Object.create(Component.prototype);

module.exports = TasksList;