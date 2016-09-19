const PageBase          = require("../app/core/page.js");
const ActionBarWrapper  = require("../app/core/action-bar.js");
const TodoAssetsService = require("../app/domain/todo-assets-service.js");
const SMFConsole        = require("../app/core/log.js");
const Router            = require("../app/core/router.js");
const TodoStore         = require("../app/domain/todo-store.js");
const TodoDetailInfoBar = require("./component/todo-detail-info-bar.js");
const SetAlarmRule      = require("./component/set-alarm-rule.js");
const TodoService       = require("../app/domain/todo-service.js");

const TodoDetailPage = function() {
  PageBase.apply(this, []);
  
  var currentTask;

  // const _actionBar = 
  // _actionBar.setVisible(true);
  // _actionBar.addMenuItem();
  // _actionBar.setB
  
  function update() {
    headText.text = currentTask.summary;
    descText.text = currentTask.desc;
    infoBar.setProps(
        TodoAssetsService.getIcon(currentTask.type, TodoAssetsService.types.black)
      , currentTask.type
      , currentTask.creationDate
      );
    // SMFConsole.dir(currentTask);
    alarmRuleComp.setProps(currentTask.alarmRule, (currentTask.status != "completed"));
    if(currentTask.status == "completed" && currentTask.isAlarmSet == false){
      alarmRuleComp._view.visible = false;
    }
  }

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
  
  const headContainer = new SMF.UI.Container({
      width: "100%"
    , height: "22.5%"
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
    , text: ""
    , height: "100%"
    , fontColor: "#ffffff"
    , width: "76%"
    , multipleLine: true
    , textAlignment: SMF.UI.TextAlignment.LEFT
  });

  headText.font.size = "12pt";
  headText.font.family = "Roboto";
  
  const descTextTitle = new SMF.UI.Label({
      text: "DETAILS"
    , height: "15%"
    , fontColor: "#27BC66"
    , width: "80%"
  });

  const descText = new SMF.UI.Label({
      multipleLine: true
    , text: ""
    , height: "80%"
    , fontColor: "#4A4A4A"
    , top: 0
    , width: "80%"
    , multipleLine: true
    , textAlignment: SMF.UI.TextAlignment.TOP
  });
  
  const descTextContainer = new SMF.UI.Container({
      width: "100%"
    , height: "52%"
    , left:0
    , top: 0
    , borderWidth: 0
    , fontColor: "#4A4A4A"
    , layoutType: SMF.UI.LayoutType.FLOW
    , layoutAlignment: SMF.UI.LayoutAlignment.CENTER
  });
  
  descTextContainer.add(descTextTitle);
  descTextContainer.add(descText);
  
  // const infoBar = new TodoDetailInfoBar({
  //     width: "100%"
  //   , height: "14%"
  // });
  
  this.setRouteParams = function(params){
    currentTask = TodoStore.findById(params.id);
    update(params);
  };
    
  // Action and Navigation bar configuration
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
              completeTask();
            }
            })
          , new SMF.UI.iOS.BarButtonItem({
            image: "Delete_detail.png"
            , onSelected: function(){
              deleteTask()
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
      // , backgroundColor: "#059466"
      , titleView: {}  
      , overlay: false
      , homeAsUpIndicator: "page_close.png"
      , displayShowHomeEnabled: true
      , alpha: 1
      , displayHomeAsUpEnabled: true
      , menuItems: [
        new SMF.UI.Android.MenuItem({
            id: "2"
          , icon: "Delete_detail.png"
          , onSelected: function(){
            deleteTask();
          }
          , showAsAction: SMF.UI.Android.ShowAsAction.ALWAYS 
        })
        , new SMF.UI.Android.MenuItem({
            id : "1"
          , icon : "completed.png"
          , onSelected: function(){
            completeTask();
          }
          , showAsAction : SMF.UI.Android.ShowAsAction.ALWAYS
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
    SMF.UI.statusBar.transparent = false;
    SMF.UI.statusBar.color       = "#059466";

    actionWrapper.reload();
    // _actionBar.transparent(0.2);
    // _actionBar.setOverlay(true);
  };
  
  const infoBar = new TodoDetailInfoBar({
      height: "17%"
    , width: "100%"
    , layoutType: SMF.UI.LayoutType.ABSOLUTE
    , verticalGap: 0
    , horizontalGap: 0
    , borderWidth: 0
  });
  
  const seperator = new SMF.UI.Rectangle({
      left: 0
    // , top: 
    , height: "1"
    , width: "100%"
    , borderColor: "#DFDFDF"
  });

  const alarmRuleComp = new SetAlarmRule({
        width: "100%"
      , height: "7%"
      , borderWidth: 0
    }
  );
  
  alarmRuleComp
    .onChange()
    .subscribe(function(rule){
      if(rule){
        currentTask.isAlarmSet = true;
        currentTask.alarmRule  = rule;
        TodoStore.save(currentTask);
        TodoService.setLocalNotification(rule, currentTask.summary, "SMF Todo Reminder");
      }
    });
  
  headContainer.add(headText);
  pageContainer.add(headContainer);
  pageContainer.add(infoBar._view);
  pageContainer.add(descTextContainer);
  pageContainer.add(seperator);
  pageContainer.add(alarmRuleComp._view);

  function close(){
    // Router.go("home");
    Router.back();
  }
  
  function deleteTask(){
    TodoStore.deleteTask(currentTask.id);
    close();
  }
  
  function completeTask(){
    TodoStore.completeTask(currentTask.id);
    close();
  }
};

TodoDetailPage.prototype = Object.create(PageBase.prototype);

module.exports = TodoDetailPage;