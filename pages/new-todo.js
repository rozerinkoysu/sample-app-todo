/* globals */
const PageBase          = require("../app/core/page.js");
const ActionBarWrapper  = require("../app/core/action-bar.js");
const TodoAssetsService = require("../app/domain/todo-assets-service.js");
const SMFConsole        = require("../app/core/log.js");
const ChildPageHeader   = require("./block/layout/child-page-header.js");
const Router            = require("../app/core/router.js");
const NewTodoTitleBar   = require("./component/new-todo-title-bar.js");
const TodoStore         = require("../app/domain/todo-store.js");

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
      , height: "100%"
      , width: "100%"
      , 
    }
    , params
    , {
        image: item.image
      , touchEnabled: false
    });
    
    const iconContainer = new SMF.UI.Container(containerParams);
    const icon = new SMF.UI.Image(params);
    iconContainer.add(icon);
    
    return iconContainer;
  };
};

// Composes icon button onSelect behaviour
const activateIconButton = function(){
  return function() {
    var activeButtonBg = new SMF.UI.Rectangle({
        width: "100%"
      , height: "100%"
      , fillColor: "#0079B6"
      , top: 0
      , left: 0
      , roundedEdge: 0
    });
    
    this.insertAt(activeButtonBg, 0);
    
    activeButtonBg.left = -1 * activeButtonBg.width;

    activeButtonBg.animate({
        property: 'left'
      , endValue: 0
      , motionEase: SMF.UI.MotionEase.DECELERATING
      , duration: 300
      , onFinish: function() {
        //do your action after finishing the animation
      }
    });
    
    return function(){
      var remove = this.removeAt.bind(this);
      
      activeButtonBg.animate({
          property: 'left'
        , endValue: activeButtonBg.width
        , motionEase: SMF.UI.MotionEase.ACCELERATING
        , duration: 300
        , onFinish: function() {
          remove(0);
          remove = null;
          activeButtonBg = null;
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
    // call icon button select bhaviour
    deselect = selectButton.call(this);
    // trigger onSelect callback
    onSelect.apply(this, [name]);
  }
}

const menuComposer = function(params) {
  const menuContainer = new SMF.UI.Container(params);
  this.add(menuContainer);

  return function(item){
    menuContainer.add(item);
  }
}

const NewTodoPage = function(params){
  PageBase.apply(this, [{
  }]);
  
  const pageContainer = new SMF.UI.Container({
      width: "100%"
    , height: "100%"
    , layoutType: SMF.UI.LayoutType.FLOW
    , top: 0
    , left: 0
    , horizontalGap: 0
    , verticalGap: 0
    , borderWidth: 0
  });
  
  SMF.UI.statusBar.visible     = true;
  // SMF.UI.statusBar.transparent = true;
  
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
    }
  }
  
  const actionWrapper = ActionBarWrapper(this._view, options);

  this._view.onShow = function() {
    actionWrapper.reload();
  };
  
  this.add(pageContainer);

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
  
  const menuItemAdd = menuComposer.apply(pageContainer, [{
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
  
  const icons =  TodoAssetsService
    .getAllIconsByType(TodoAssetsService.types.white)
    .map(createIconButton({
      onTouch: iconButtonSelectHandler(
        // icon button onSelect behaviour
        activateIconButton
        // icon button onSelect handler
        , function(name){
          newTaskData.type = name;
          const title = "ADD "+name+" TASK";
          newTaskBar.setTitle(title.toUpperCase());
        })
    }));

  icons.map(menuItemAdd);
  
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
  
  const summaryContainer = new SMF.UI.Container({
      width: "100%"
    , height: "8.94%"
    , borderWidth: 0
  });
  
  summaryContainer.add(summary);

  // creates line seperator which it seperates between summary and detail texts
  const seperator = new SMF.UI.Rectangle({
      left: 0
    // , top: 
    , height: "1"
    , width: "100%"
    , fillColor: "#000000"
  });
  
  // create todo detail text container
  const detailContainer = new SMF.UI.Container({
      width: "100%"
    , height: "20%"
    , borderWidth: 0
  });
  
  // creates todo detail text
  const detailtext = new SMF.UI.TextBox({
      width: "90%"
    , left: "5%"
    , top: 0
    , height: "100%"
    , borderWidth: 0
    , placeHolder: "Add details"
    , placeHolderTextColor: "#4A4A4A"
    , text: ""
  });
  
  // then adds detailtext to contaier
  detailContainer.add(detailtext);
  
  // add children to pagecontainer
  pageContainer.add(newTaskBar._view);
  pageContainer.add(summaryContainer);
  pageContainer.add(seperator);
  pageContainer.add(detailContainer);
  
  // Saves current data and routes to homepage
  function save(){
      newTaskData.summary = summary.text;
      newTaskData.desc    = detailtext.text;
      newTaskData.status = "idle";
      TodoStore.add(newTaskData);
      Router.go("home");
  }
  
  function close(){
    Router.go("home");
  }
};

NewTodoPage.prototype = Object.create(PageBase.prototype);

module.exports = NewTodoPage;