const SliderDrawerComp = require("../../app/core/component/slider-drawer.js");
// const TodoStore = require("../app/domain/todo-store.js");
// const TaskStatisticsComp = require("./task-statistics-comp.js");

const AppSliderDrawerMenu = function(params, props){
  SliderDrawerComp.apply(this, [params]);
  
  const bgImage = new SMF.UI.Image({
      top: "0"
    , left: "0"
    , height: "100%"
    , width: "100%"
    , image: "Bg.png"
    , imageFillType: SMF.UI.ImageFillType.STRETCH
  });
/*  const todoStore = new TodoStore();
  const lastWeekTasks = todoStore.getAllLastWeek();
  
  const lastWeekTasksPage = new TaskStatisticsComp();
  lastWeekTasksPage.setData(lastWeekTasks);
  this.add(lastWeekTasksPage);
*/
  this.add(bgImage);
}

AppSliderDrawerMenu.prototype = Object.create(SliderDrawerComp.prototype);

module.exports = AppSliderDrawerMenu;