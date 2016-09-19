/* 
  New Todo Creation Child Page
*/

const PageBase          = require("../app/core/page.js");
const ActionBarWrapper  = require("../app/core/action-bar.js");
const TodoAssetsService = require("../app/domain/todo-assets-service.js");
const SMFConsole        = require("../app/core/log.js");
const ChildPageHeader   = require("./block/layout/child-page-header.js");
const Router            = require("../app/core/router.js");
const NewTodoTitleBar   = require("./component/new-todo-title-bar.js");
const TodoStore         = require("../app/domain/todo-store.js");
const SetAlarmRule      = require("./component/set-alarm-rule.js");
const TodoService         = require("../app/domain/todo-service.js");

// Composes icon button builder
const createIconButton = function(params) {
  params = params || {};
  // create icon button
  return function(item){
    
    const containerParams = {
        height: "50%"
      , width: "24.94%"
      , borderWidth: 0
      , verticalGap: 0
      , horizontalGap: 0
      , layoutType: SMF.UI.LayoutType.ABSOLUTE
      , onTouch: function(){
        params.onTouch.apply(this, [item.name]);
      }
    };
    
    params = Object.assign({
        top: 0
      , left: 0
      , height: "80%"
      , width: "100%"
      , 
    }
    , params
    , {
        image: item.image
      , touchEnabled: false
    });
    
    const iconText = new SMF.UI.Label({
        width: "80%"
      , height: "60%"
      , top: "45%"
      , text: item.name.toUpperCase()
      , fontColor: "#ffffff"
      , textAlignment: SMF.UI.TextAlignment.CENTER
      , touchEnabled: false
    });
    
    iconText.font.family = "Roboto";
    iconText.font.size = "5pt"
    
    const iconContainer = new SMF.UI.Container(containerParams);
    const icon = new SMF.UI.Image(params);
    iconContainer.add(icon);
    iconContainer.add(iconText);
    
    return iconContainer;
  };
};

// Composes icon button onSelect behaviour
const activateIconButton = function(){
  return function() {
    var activeButtonBackgroundRect = new SMF.UI.Rectangle({
        width: "100%"
      , height: "100%"
      , fillColor: "#0079B6"
      , top: 0
      , left: 0
      , roundedEdge: 0
      , borderWidth: 0
    });
    
    this.insertAt(activeButtonBackgroundRect, 0);
    
    activeButtonBackgroundRect.left = -1 * activeButtonBackgroundRect.width;

    activeButtonBackgroundRect.animate({
        property: 'left'
      , endValue: 0
      , motionEase: SMF.UI.MotionEase.DECELERATING
      , duration: 150
      , onFinish: function() {
        //do your action after finishing the animation
      }
    });
    
    return function(){
      var remove = this.removeAt.bind(this);
      
      activeButtonBackgroundRect.animate({
          property: 'left'
        , endValue: activeButtonBackgroundRect.width
        , motionEase: SMF.UI.MotionEase.ACCELERATING
        , duration: 150
        , onFinish: function() {
          remove(0);
          remove = null;
          activeButtonBackgroundRect = null;
        }
      });
    }.bind(this);
  };
};

// Icon-button selected handler
const iconButtonSelectHandler = function(itemActivate, onSelect) {
  var deselect = function(){};
  const selectButton = itemActivate();
  return function(name) {
    deselect();
    // call icon button select bhaviour and assign function that removes button effect
    deselect = selectButton.call(this);
    // trigger onSelect callback
    onSelect.apply(this, [name]);
  };
};

const menuComposer = function(params) {
  const menuContainer = new SMF.UI.Container(params);
  this.add(menuContainer);

  return function(item){
    menuContainer.add(item);
  };
};

const NewTodoPage = function(params){
  PageBase.apply(this, [{
  }]);
  
  const pageLayoutContainer = new SMF.UI.Container({
      width: "100%"
    , height: "100%"
    , layoutType: SMF.UI.LayoutType.FLOW
    , top: 0
    , left: 0
    , horizontalGap: 0
    , verticalGap: 0
    , borderWidth: 0
  });
  
  const options = {
      visible: true
    , backgroundImage: null
    , backgroundColor: "#0079B6"
    , enabled: true
  };
    
  if(Device.deviceOS == "iOS") {
    options.ios = {
        rightBarButtonItems: [
            new SMF.UI.iOS.BarButtonItem({
              image: "completed.png"
            , onSelected: function(){
              save();
            }
            })
        ]
      , leftBarButtonItems: [
          new SMF.UI.iOS.BarButtonItem({
              image : "page_close.png"
            , onSelected: function(){
              close();
            }
          })
      ]
      , translucent: false
      , titleView: {}
    };
  } else {
    options.android = {
        hideOnContentScroll: false
      // , backgroundColor: "#000000"
      , titleView: {}  
      , overlay: false
      , homeAsUpIndicator: "page_close.png"
      , displayShowHomeEnabled: true
      , alpha: 1
      , displayHomeAsUpEnabled: true
      , menuItems: [
        new SMF.UI.Android.MenuItem({
            id : "1"
          , icon : "completed.png"
          , onSelected: function(){
            save();
          }
          , showAsAction : SMF.UI.Android.ShowAsAction.ALWAYS //Always place this item in the Action Bar. Avoid using this unless it's critical that the item always appear in the action bar. Setting multiple items to always appear as action items can result in them overlapping with other UI in the action bar.
        })
      ]
    };
    
    this._view.actionBar.onHomeIconItemSelected = function () {
      close();
    };
  }
  
  const actionWrapper = ActionBarWrapper(this._view, options);

  this._view.onShow = function() {
    SMF.UI.statusBar.visible     = true;
    SMF.UI.statusBar.color       = "#00A1F1";
    SMF.UI.statusBar.transparent = false;
    actionWrapper.reload();
  };
  
  this.add(pageLayoutContainer);

  const newTaskBar = new NewTodoTitleBar({
      // top: "39%"
      width: "100%"
    , height: "14.74%"
    , left: 0
  });
  
  const newTaskData = {};
  
  // const header = new ChildPageHeader("New ToDo");
  // pageContainer.add(header._view);
  // const space = new SMF.UI.Rectangle({
  //     width: "100%"
  //   , height: "11%"
  //   // , top: "11%"
  //   , left: 0
  //   , borderWidth: 0
  //   , fillColor: "#00A1F1"
  // });
  
  // pageContainer.add(space);
  
  // composes icon button builder
  // and sends menu container for adding buttons
  const menuItemAdd = menuComposer.apply(pageLayoutContainer, [{
      width: "100%"
    , height: "28%"
    // , top: "11%"
    , left: 0
    , layoutType: SMF.UI.LayoutType.FLOW
    , borderWidth: 0
    , fillColor: "#00A1F1"
    , backgroundTransparent: false
    , horizontalGap: 0
    , verticalGap: 0
  }]);
  
  // Create icon buttons
  const icons =  TodoAssetsService
    // Gets all icons by type and color
    .getAllIconsByType(TodoAssetsService.types.white)
    // then creates iconbuttons using icons data
    .map(createIconButton({
      // when user touchs any button
      onTouch: iconButtonSelectHandler(
        // then sends selection behaviour
        activateIconButton
        // and custom behaviour callback for present button
        , function(name){
          // assings icon type to current state
          newTaskData.type = name;
          // creates title 
          const title = "ADD "+name+" TASK";
          // and prints to infobar
          newTaskBar.setTitle(title.toUpperCase());
        })
    }));
  // maps icons data to icon button builder
  icons.map(menuItemAdd);
  
  // Create summary text input
  const summary = new SMF.UI.TextBox({
      width: "90%"
    , left: "5%"
    , top: 0
    , height: "100%"
    , borderWidth: 0
    , placeHolder: "Summary"
    , placeHolderTextColor: "#009DEB"
    , text: ""
  });
  
  // Create container for summary text placement
  const summaryContainer = new SMF.UI.Container({
      width: "100%"
    , height: "8.94%"
    , borderWidth: 0
  });
  
  summaryContainer.add(summary);

  // creates line seperator which it seperates summary and detail texts
  const seperator = new SMF.UI.Rectangle({
      left: 0
    // , top: 
    , height: "1"
    , width: "100%"
    , borderColor: "#DFDFDF"
  });
  
  // create todo detail text container
  const detailContainer = new SMF.UI.Container({
      width: "100%"
    , height: "40%"
    , borderWidth: 0
  });
  
  // creates todo detail textbox
  const detailtext = new SMF.UI.TextBox({
      width: "90%"
    , left: "5%"
    , top: "10%"
    , height: "90%"
    , borderWidth: 0
    , placeHolder: "Add details"
    , placeHolderTextColor: "#4A4A4A"
    , textAlignment: SMF.UI.TextAlignment.TOP
    , text: ""
  });
  
  // then adds detailtext to contaier
  detailContainer.add(detailtext);
  
  const alarmRuleComp = new SetAlarmRule({
        width: "100%"
      , height: "7%"
      , borderWidth: 0
    }
    , false
    , true
  );
  
  alarmRuleComp.onChange().subscribe(function(rule){
    newTaskData.isAlarmSet = true
    newTaskData.alarmRule = rule;
  })
  
  // add children to pageLayoutContainer
  pageLayoutContainer.add(newTaskBar._view);
  pageLayoutContainer.add(seperator.clone());
  pageLayoutContainer.add(summaryContainer);
  pageLayoutContainer.add(seperator);
  pageLayoutContainer.add(detailContainer);
  pageLayoutContainer.add(seperator.clone());
  pageLayoutContainer.add(alarmRuleComp._view);
  
  // Saves current data then routes to homepage
  function save(){
    // If new task type is not be selected
    if(!newTaskData.type) {
      // then alert warning message
      alert("Please select a Todo Type from Types Menu.");
      // and break saving
      return;
      // Else if summary is not inputed by user
    } else if(!summary.text) {
      // then alert warning message
      alert("Please fill in the summary field.");
      // and break saving
      return;
    } 
    // else if(!detailtext.text){
    //   alert("Please fill in the details field.");
    //   return;
    // }
    
    // saves user data
    newTaskData.summary = summary.text;
    newTaskData.desc    = detailtext.text;
    newTaskData.status  = "idle";
    
    if(newTaskBar.isAlarmSet){
      TodoService.setLocalNotification(newTaskBar.alarmRule, newTaskBar.summary, "SMF Todo Reminder");
    }
    
    // and create new todo item in the data-store
    TodoStore.add(newTaskData);
    // Router.go("home");
    // then back to home
    close();
  }
  
  
  function close(){
    Router.back();
    // Router.go("home");
  }
};

NewTodoPage.prototype = Object.create(PageBase.prototype);

module.exports = NewTodoPage;