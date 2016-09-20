const PageLayout = require("./page-layout.js");
const Router     = require("../app/core/router.js");
const TasksBlock = require("./block/home/tasks-block.js");
const SMFConsole = require("../app/core/log.js");


/**
 * User dashboard page, it includes open and completed tasks lists that created by user and
 * can be deleted or completed by user. 
*/
var HomePage = function() {
  // calls super class contructor
  PageLayout.apply(this, [{
      name: "homePage"
    , fillColor: "#ffffff"
  }]);
  
  try{
    // create user's tasks lists
    const tasksBlock = new TasksBlock();
    // add to layout content container
    this.add(tasksBlock);
    // create new todo button
    const newTodoButton = new SMF.UI.Image({
        image: "fab.png"
      , imageFillType: SMF.UI.ImageFillType.AUTOSIZE
      , left: "80%"
      , top: "26%"
      // when button is touched by user
      , onTouch: function(e){
        // routes to new todo creation page
        Router.go("todo/new");
      }
    });
    
    // add button to layout content container
    this.add(newTodoButton);
  } catch(e) {
    SMFConsole.error("[HomePage]", e);
  }
};

HomePage.prototype = Object.create(PageLayout.prototype);

module.exports = HomePage;