const TaskProgressBarComp = require("./progressbar-comp.js");
const Component           = require("../../app/core/component.js");
const SMFConsole          = require("../../app/core/log.js");
const TodoStore           = require("../../app/domain/todo-store.js");

/*
  Tasks completion report by last week or last month
*/
const TaskStatisticsContent = function(finder) {
  Component.apply(this, [{
      width: "98%"
    , height: "80%"
    , borderWidth: 0
    , layoutType: SMF.UI.LayoutType.FLOW
    , verticalGap: 0
    , showScrollbar: true
  }]);
  
  this._items = [];
  // saves curent scope
  const _that = this;
  
  // invalidates component
  const update = function() {
    // Get grouped todos by type
    const grouped = TodoStore
      .groupByPropName("type")(
        TodoStore.find(
          TodoStore.findByLastMonth("creationDate")
        )
      );

    _that._items = [];
    // clear progressbars of component
    _that.clear();
    // loop grouped data
    Object.keys(grouped)
      .forEach(function(key) {
        /**
         * creates progressbar component
         * @type {TaskProgressBarComp}
         */
        var bar = new TaskProgressBarComp(key, grouped[key]);
        // Gets completed tasks
        var completedTasks = finder(grouped[key]);
        // update progressbar width
        bar.setProps(completedTasks.length, grouped[key].length);
        // add progressbar to component view
        _that.add(bar);
        // start progressbar animation
        bar.animate();
        // and add to progressbars collection
        _that._items.push(bar);
      });
  };
  
  try{
    // initialize component
    update();
    // Subscribes to store data change stream
    TodoStore
      .changeHandler$()
      .subscribe(function() {
        // and invalidates component when store is changed.
        update();
      });
  } catch(e) {
    SMFConsole.error("[TaskStatisticsContent]", e);
  }
};

TaskStatisticsContent.prototype = Object.create(Component.prototype);

/**
 * Triggers progress bars animations of component
 */
TaskStatisticsContent.prototype.show = function(){
  this._items.forEach(function(bar){
    bar.animate();
  });
};

module.exports = TaskStatisticsContent;