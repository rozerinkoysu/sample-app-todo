const HomePage       = require("./pages/home.js");
const NewTodoPage    = require("./pages/new-todo.js");
const TodoDetailPage = require("./pages/todo-detail.js");
const Router         = require("./app/core/router.js");
const SMFConsole     = require("./app/core/log.js");


// Defines routes of application pages
Router.add(
    "todo/new"
    , NewTodoPage
    , function() {
      return [SMF.UI.MotionEase.DECELERATING, SMF.UI.TransitionEffect.RIGHTTOLEFT, SMF.UI.TransitionEffectType.NONE,false,false];
    });

Router.add("todo/detail", TodoDetailPage, function(){
    return [SMF.UI.MotionEase.DECELERATING, SMF.UI.TransitionEffect.RIGHTTOLEFT, SMF.UI.TransitionEffectType.NONE,false,false];
});

Router.add("home", HomePage, function(){
    return [SMF.UI.MotionEase.DECELERATING, SMF.UI.TransitionEffect.LEFTTORIGHT, SMF.UI.TransitionEffectType.PUSH,false,false];
});

Router.go("home");