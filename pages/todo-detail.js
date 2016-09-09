const PageBase          = require("../app/core/page.js");
const ActionBarWrapper  = require("../app/core/action-bar.js");
const TodoAssetsService = require("../app/domain/todo-assets-service.js");
const SMFConsole        = require("../app/core/log.js");
const Router            = require("../app/core/router.js");
const TodoStore         = require("../app/domain/todo-store.js");
const TodoDetailInfoBar = require("./component/todo-detail-info-bar.js");

const TodoDetailPage = function(routeParams) {
  PageBase.apply(this, []);
  
  const currentTask = TodoStore.findById(routeParams.id);

  // const _actionBar = 
  // _actionBar.setVisible(true);
  // _actionBar.addMenuItem();
  // _actionBar.setB
  

    
  SMF.UI.statusBar.visible     = true;
  SMF.UI.statusBar.transparent = true;

  const pageContainer = new SMF.UI.Container({
      width: "100%"
    , height: "100%"
    , layoutType: SMF.UI.LayoutType.FLOW
    , top: "0"
    , left: "0"
    , horizontalGap: 0
    , verticalGap: 0
    , borderWidth: 0
  });
  
  this.add(pageContainer);
  
  const head = new SMF.UI.Container({
      width: "100%"
    , height: "34%"
    , top: "0"
    , left: 0
    , layoutType: SMF.UI.LayoutType.ABSOLUTE
    , borderWidth: 0
    , fillColor: "#07BA80"
    , backgroundTransparent: false
    , horizontalGap: 0
    , verticalGap: 0
  });
  

  const headText = new SMF.UI.Label({
      multipleLine: true
    , left: "10%"
    , top: "15%"
    , text: currentTask.summary
    , height: "100%"
    , fontColor: "#ffffff"
    , width: "76%"
    , multipleLine: true
    , textAlignment: SMF.UI.TextAlignment.LEFT
  });
  
  headText.font.size = "12pt";
  headText.font.family = "Roboto";
  
  const options = {
      visible: true
    , backgroundImage: null
    , backgroundColor: "#059466"
    , enabled: true
  };
    
  if(Device.deviceOS == "iOS"){
    options.ios = {
        rightBarButtonItems: [
            new SMF.UI.iOS.BarButtonItem({
              image: "completed.png"
            , onSelected: function(){
              console.log("complete");
            }
            })
          , new SMF.UI.iOS.BarButtonItem({
            image: "Delete_detail.png"
            , onSelected: function(){
              console.log("delete");
            }
          })
        ]
      , leftBarButtonItems: [
          new SMF.UI.iOS.BarButtonItem({image : "page_close.png"})
      ]
      , translucent: true
      , titleView: {}
    };
  } else {
    head.height = "36%";
    
    options.android = {
        hideOnContentScroll: false
      , backgroundColor: "#000000"
      , titleView: {}  
      , overlay: true
      , homeAsUpIndicator: "page_close.png"
      , displayShowHomeEnabled: true
      , alpha: 0.2
      , displayHomeAsUpEnabled: true
      , menuItems: [
        new SMF.UI.Android.MenuItem({
            id: "2"
          , icon: "Delete_detail.png"
          , onSelected: function(){
            console.log("delete");
          }
          , showAsAction: SMF.UI.Android.ShowAsAction.ALWAYS //Always place this item in the Action Bar. Avoid using this unless it's critical that the item always appear in the action bar. Setting multiple items to always appear as action items can result in them overlapping with other UI in the action bar.
        })
        , new SMF.UI.Android.MenuItem({
            id : "1"
          , icon : "completed.png"
          , onSelected: function(){
            console.log("complete");
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
    SMFConsole.log("on show");
    actionWrapper.reload();
    // _actionBar.transparent(0.2);
    // _actionBar.setOverlay(true);
  };
  
  // const infoBar = new TodoDetailInfoBar({
  //   height: "22%"
  // })
  
  head.add(headText);
  pageContainer.add(head);
  
  function onComplete(){
    
  }
  
  function close(){
    Router.go("home");
  }
};

TodoDetailPage.prototype = Object.create(PageBase.prototype);

module.exports = TodoDetailPage;