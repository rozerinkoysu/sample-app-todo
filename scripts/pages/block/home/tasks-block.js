const Component  = require("../../../app/core/component.js");
const TodoStore  = require("../../../app/domain/todo-store.js");
const TasksList  = require("../../component/tasks-list.js");
const TodayBar   = require("../../component/today-bar.js");
const SMFConsole = require("../../../app/core/log.js");
const Router     = require("../../../app/core/router.js");

/**
 * User's dashboard
 */
const TasksBlock = function() {
  
  // Calls super constructor
  Component.apply(this, [{
      width: "100%"
    , height: "100%"
    , left: 0
    , top: 0
    , borderWidth: 0
  }]);
  
  // sets initial state of component
  var state = {
    show: "idle"
  };
  
  // creates tab button underline rectangle
  const underline = new SMF.UI.Rectangle({
      width: "30%"
    , height: "2"
    , fillColor: "#ffffff"
    , borderWidth: 0
    , top: "31.6%"
    , left: "5%"
    , roundedEdge: 0
  });
  
  if(Device.deviceOS == "Android"){
    underline.height = 4;
  }
  
  // creates onTabChange handler
  const tabChangeHandler = tabChanger(underline);
  
  // updates component when state is changed
  const update = function(){
    tasksList.setTasks(getTasks(), state.show);
  };
  
  // changes component state
  const changeState = function(stateUpdate){
    return function(){
      state = Object.assign(state, stateUpdate);
      update();
    };
  };
  
  const getTasks = function(){
    return TodoStore.find(TodoStore.findByStatus(state.show));
  };
  
  /**
   * Create todo tab button
   */
  const todoButton = new SMF.UI.Label({
      height: "10%"
    , top: "25%"
    , left: "10%"
  });
  
  todoButton.text        = "TO DO";
  todoButton.font.size   = "8pt";
  todoButton.font.bold   = true;
  todoButton.font.family = "Roboto";
  todoButton.fontColor   = "#ffffff";
  todoButton.autoSize    = true;
  // todoButton.width       = "30%";
  /**
   * Create tab button for completed tasks
   */
  const completedButton       = new SMF.UI.Label({
      height: "10%"
    , top: "25%"
    , left: "40%"
  });
  completedButton.text        = "COMPLETED";
  completedButton.font.size   = "8pt";
  completedButton.font.bold   = true;
  completedButton.font.family = "Roboto";
  completedButton.fontColor   = "#ffffff";
  completedButton.autoSize    = true;
  // todoButton.width       = "30%";
  // completedButton.height      = "10%";
  // completedButton.top         = "23%";
  // completedButton.left        = "40%";
  completedButton.alpha       = 0.6;
  // compose completedButton onTouchHandler
  // create today-bar component
  const todayBar = new TodayBar({
      width: "100%"
    , height: "14.7%"
    , top: "32%"
    , left: 0
  });
  // and add to current component as a child
  this.add(todayBar);
  
  // console.log(TodoStore)
  const tasksList = new TasksList({
      width: "100%"
    , height: "53.3%"
    , top: "46.7%"
    , left: 0
    , borderWidth: 0
  });
  
  tasksList.setTasks(getTasks());
  
  // listens todostore onChange stream
  // so that side-effects move out from component
  TodoStore
    .changeHandler$()
    .subscribe(function(){
      // and update component when data is changed on todo-store.
      update();
    });
  
  // add children components
  this.add(tasksList);
  this.add(todoButton);
  this.add(completedButton);
  this.add(underline);

  const todoButtonTouchHandler = tabChangeHandler(
      todoButton.left - todoButton.width / 12
    , todoButton.width + todoButton.width / 9
    , changeState({show: "idle"})
    // , todoButton
  );
  
  todoButton.onTouch = todoButtonTouchHandler;
  
  // todoButton.onTouch();

  // compose todoButton onTouchHandler
  completedButton.onTouch = tabChangeHandler(
      completedButton.left - completedButton.width / 12
    , completedButton.width + completedButton.width / 9
    , changeState({show: "completed"})
  );
  
  todoButtonTouchHandler.call(todoButton);
  // this.add(newTaskButton);
};

// Composes tabChange function
const tabChanger = function(underline) {
  var current;
  
  return function(underlinePos, underlineWidth, changeState, btn){
    if(btn){
      current = btn;
    }
    /**
     * Start tab button animation and trigger block component state changing
     *
     */
    return function(e) {
      changeState();
      if(this !== current) {
        underline.animate({
            property: 'left',
            endValue: underlinePos,
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
        });
  
        underline.animate({
            property: 'width',
            endValue: underlineWidth,
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
        });
        
        if(current) {
          current.animate({
            property: 'alpha',
            endValue: 0.6,
            motionEase: SMF.UI.MotionEase.PLAIN,
            duration: 300,
            onFinish: function() {
                //do your action after finishing the animation
            }
          });
        }
        this.animate({
          property: 'alpha',
          endValue: 1,
          motionEase: SMF.UI.MotionEase.PLAIN,
          duration: 300,
          onFinish: function() {
              //do your action after finishing the animation
          }
        });

        current = this;
      };
    };
  };
};

TasksBlock.prototype = Object.create(Component.prototype);

module.exports = TasksBlock;