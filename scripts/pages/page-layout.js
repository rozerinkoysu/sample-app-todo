/**
 *  PageLayout is the base class of application parent pages. It is the best 
 *  practice of page layout implemantation. Children classes which is 
 *  extended from this class inherits common parts and behaviours of layout
 *  for example Actionbar, Sliderdrawer, HeaderBlock etc. Child class 
 *  content is added to a separate child container of layout.
*/

const PageBase              = require("../app/core/page.js");
const HeaderBlock           = require("./block/layout/header-block.js");
const SMFConsole            = require("../app/core/log.js");
const ActionWrapper         = require("../app/core/action-bar.js");
const SliderDrawerComp      = require("./component/app-slider-drawer.js");
const TabButtonGroup        = require("../app/core/component/tab-button-group.js");
const TaskStatisticsContent = require("./component/task-statistics-content.js");
const TodoStore             = require("../app/domain/todo-store.js");
const AbstractComponent     = require("../app/core/abstract-component.js");

// Calls super class's add method
const superAdd = function(child) {
  try {
    PageBase.prototype.add.apply(this, [child]);
  } catch(e) {
    e.message = child +"  "+e.message;
    throw e;
  }
};

// App specific Base-Page-layout class
const PageLayout = function(params) {
  
  // params.onControlAdded = function(e){
  //   SMFConsole.dir("child added", e.control);
  // };
  // params.width         = "100%";
  // params.layoutType    = SMF.UI.LayoutType.FLOW;
  // params.verticalGap   = 0;
  // params.horizontalGap = 0;
  // params.layoutAlignment = SMF.UI.LayoutAlignment.CENTER;
  
  // calls super class constructor
  PageBase.apply(this, [params]);

  const options = {
      visible: true
    , backgroundImage: null
    , backgroundColor: "#0079B6"
    , enabled: true
  };
  
    // var mainNavToggleOnSelected = ActionBarWrapper.addLeftBarButtonItem("Menu.png");
  
    // const sliderMenuIconClick$ = Rx
    //   .Observable
    //   .create(function(observer){
    //     mainNavToggleOnSelected(function(e){
    //       observer.onNext(e);
    //     });
        
    //     return function(){
    //       observer.onComplete();
    //     }
    //   })
    //   .share();
      
  if(Device.deviceOS == "iOS") {
    options.ios = {
        rightBarButtonItems: []
      , leftBarButtonItems: [new SMF.UI.iOS.BarButtonItem({
          image : "Menu.png"
        , onSelected: function(){
          _sliderDrawer.toggle();
        }
      })]
      , translucent: false
      , titleView: {        
          type: SMF.UI.TitleViewType.IMAGE
        , frame: [90, 5, 68.5, 39.5]
        , image: "logo.png"
      }
    };
  } else {
    options.android = {
        hideOnContentScroll: false
      , titleView: {
          type: SMF.UI.TitleViewType.IMAGE
        , frame: [130.75, 0, 68.5, 39.5]
        , image: "logo.png"
      }  
      , overlay: false
      , homeAsUpIndicator: "Menu.png"
      , displayShowHomeEnabled: true
      , alpha: 1
      , displayHomeAsUpEnabled: true
      , menuItems: []
    };
  }
  
  // initializes ActionBarWrapper
  var actionBar = ActionWrapper(this._view, options);

  this._view.onShow = function(){
    SMF.UI.statusBar.visible     = true;
    SMF.UI.statusBar.color       = "#0079B6"
    SMF.UI.statusBar.transparent = false;
    actionBar.reload();
  }
  
  // saves curent scope
  const _that = this;
  // creates SliderDrawer Component
  const _sliderDrawer = new SliderDrawerComp({
      width: '90%'
    , height: "100%"
    // , touchEnabled: 'false'
    // , layoutType: SMF.UI.LayoutType.FLOW
    // , layoutAlignment: SMF.UI.LayoutAlignment.CENTER
    , horizontalGap: 0
    , verticalGap: 0
    , left: 0 
    , top: 0
    , position: 'left'
    , onHide: function(){
      // _that._view.remove(this);
    }
  });
  
  const tabButtons = new TabButtonGroup({
      width: "80%"
    , height: "90%"
    , top: "5%"
    , left: 0
    , borderWidth: 0
    , touchEnabled: true
    , verticalGap: 0
    , horizontalGap: 0
    , layoutType: SMF.UI.LayoutType.FLOW
    , layoutAlignment: SMF.UI.LayoutAlignment.CENTER
  }, 
  {
      width: "100%"
    , height: "12%"
    , top: 0
    , layoutType: SMF.UI.LayoutType.FLOW
    , layoutAlignment: SMF.UI.LayoutAlignment.CENTER
    , borderWidth: 0
    , horizontalGap: 10
    , verticalGap: 0
  },
  {
      width: "80%"
    , top: 0
    , left: 0
    , height: "70%"
    , borderWidth: 0
    , layoutType: SMF.UI.LayoutType.FLOW
    , layoutAlignment: SMF.UI.LayoutAlignment.CENTER
    , horizontalGap: 0
    , verticalGap: 0
  }
  );
  
  const activeColor   = "#47899B";
  const selectedColor = "#376C7C";
  
  const lastWeekButton       = new SMF.UI.TextButton({
      fillColor: selectedColor
    , text: "Last Week"
    , width: '40%'
    , height: "100%"
    , touchEnabled: true
    , pressedFillColor: activeColor
  });
  
  lastWeekButton.text        = "Last Week";
  lastWeekButton.font.size   = "7pt";
  lastWeekButton.font.family = "Roboto";

  const lastMonthButton = new SMF.UI.TextButton({
      fillColor: activeColor
    , text: "Last Month"
    , width: '40%'
    , height: "100%"
    , touchEnabled: true
    , pressedFillColor: activeColor
  });

  lastMonthButton.font.size    = "7pt";
  lastMonthButton.font.family  = "Roboto";
  // TodoStore.findByLastMonth("completionDate")(TodoStore.find(TodoStore.findByLastMonth("creationDate"))).map(SMFConsole.dir);
  // SMFConsole.log(TodoStore.findByLastMonth("completionDate")(TodoStore.find(TodoStore.findByLastMonth("creationDate"))));

  tabButtons.add(lastWeekButton, new TaskStatisticsContent(TodoStore.findByLastWeek("completionDate")), "lastWeekButton", true);
  tabButtons.add(lastMonthButton, new TaskStatisticsContent(TodoStore.findByLastMonth("completionDate")), "lastMonthButton");

  const deleteTabButtonTouch = tabButtons
    .changeHandler()
    .subscribe(
      function(e) {
        if(e.current) {
          e.current.fillColor = activeColor;
        }
        e.target.fillColor = selectedColor;
      },
      function(err) {
      },
      function() {
      });
  
  _sliderDrawer.add(tabButtons);

  this._header           = new HeaderBlock();
  this._contentContainer = new SMF.UI.Container({
      width: "100%"
    , height: "100%"
    , left: 0
    , top: 0
    , borderWidth: 0
    , verticalGap: 0
    , horizontalGap: 0
    , backgroundTransparent: true
  });
  
  superAdd.apply(this, [this._header]);
  superAdd.apply(this, [this._contentContainer]);
  superAdd.apply(this, [_sliderDrawer]);
  
  tabButtons._view.left = "10%"
  // _sliderDrawer._view.width/2 - tabButtons.getWidth()/2;

/*  this._view.onClose = function(e){
    // _sliderDrawer._view.clear();
    deleteTabButtonTouch();
    unloadStream();
    this.clear();
  }
*/
};

// extends from PageBase Class
PageLayout.prototype = Object.create(PageBase.prototype);

// Overrides super class's add method,
PageLayout.prototype.add = function(content) {
  if (content instanceof AbstractComponent) {
    this._contentContainer.add(content._view);
  } else {
    this._contentContainer.add(content);
  }
};

module.exports = PageLayout;