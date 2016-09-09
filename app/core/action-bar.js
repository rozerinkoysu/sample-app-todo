/* globals */

const SMFConsole = require('./log.js');

/** @type {SMF.UI.iOS.NavigationBar | SMF.UI.Page.actionBar}*/

const assignKeys = function(source, options, ignoreKey, hasKeyThenReload) {
  return function(key) {
    // alert(options[key]);
    if(key != ignoreKey) {
      if(key != hasKeyThenReload && source.hasProp(key)) {
        source.set(key,  options[key]);
      } else if(key == hasKeyThenReload) {
        Object.keys(options[key]).forEach(assignKeys(source, options[key], "ios", "android"));
      } else {
        throw new Error("Option ["+key+"] is not found");
      }
    }
  };
};

const NullProperty = function(){
}

const AndroidProxy = function(actionBar){
  return {
    hasProp: function(prop){
      return !(this.get(prop) instanceof NullProperty);
    },
    get: function(prop){
      if(actionBar.hasOwnProperty(prop)){
        return actionBar[prop];
      }

      return new NullProperty();
    }
    , set: function(prop, value){
      if(actionBar.hasOwnProperty(prop)){
        return actionBar[prop] = value;
      } 

      return new NullProperty();
    }
  }
}

const iOSProxy = function(navigationBar, page){
  return {
    hasProp: function(prop){
      return navigationBar.hasOwnProperty(prop) 
        || (page.navigationItem && page.navigationItem.hasOwnProperty(prop));
    }
    , get: function(prop){
      if(navigationBar.hasOwnProperty(prop)){
        return navigationBar[prop];
      } else if(page.navigationItem && page.navigationItem.hasOwnProperty(prop)){
        return page.navigationItem[prop];
      } 

      return new NullProperty();
    }
    , set: function(prop, value){
      if(navigationBar.hasOwnProperty(prop)){
        return navigationBar[prop] = value;
      } else if(page.navigationItem && page.navigationItem.hasOwnProperty(prop)){
        return page.navigationItem[prop] = value;
      }

      return new NullProperty();
    }
  }
}

const runOnAndroid = function(page, options) {
  const actionBarProxy = new AndroidProxy(page.actionBar);
  return {
    unload: function(){
      this.reset();
      page = null;
      options = null;
      actionBarProxy = null;
    }
    , reset: function(){
      Object
        .keys(ActionBarWrapper.options)
        .forEach(
          assignKeys(actionBarProxy, ActionBarWrapper.options, "ios", "android"));
    }
    , reload: function(){
      Object
        .keys(options)
        .forEach(assignKeys(actionBarProxy, options, "ios", "android"));
    }
    , update: function(newOptions){
      newOptions = Object.assign({}, newOptions);
      Object
        .keys(options)
        .forEach(assignKeys(actionBarProxy, options, "ios", "android"));
      options = Object.assign(options, newOptions);
    }
  };
};

const runOniOS = function(page, options) {
  var navigationProxy = new iOSProxy(SMF.UI.iOS.NavigationBar, page);
  return {
    unload: function(){
      this.reset();
      page = null;
      options = null;
    }
    , reset: function(){
      Object
        .keys(ActionBarWrapper.options)
        .forEach(
          assignKeys(navigationProxy, ActionBarWrapper.options, "android", "ios"));
    }
    , reload: function(){
      Object
        .keys(options)
        .forEach(assignKeys(navigationProxy, options, "android", "ios"));
    }
    , update: function(newOptions){
      newOptions = Object.assign({}, newOptions);
      Object
        .keys(options)
        .forEach(assignKeys(navigationProxy, options, "android", "ios"));
      options = Object.assign(options, newOptions);
    }
  };
};

const ActionBarWrapper = function(page, options) {
  options = Object.assign({}, options);
  
  if (Device.deviceOS === "Android") {
    return runOnAndroid(page, options);
  } else {
    return runOniOS(page, options);
  }
};

ActionBarWrapper.options = {
    visible: false
  , overlay: false
  , backgroundImage: null
  , backgroundColor: "#000000"
  , titleView: {}
  , enabled: true
  , ios: {
      rightBarButtonItems: []
    , leftBarButtonItems: []
    , translucent: false
  }
  , homeButton: null
  , android: {
      hideOnContentScroll: false
    , icon: null
    , onHomeIconItemSelected: null
    , displayShowHomeEnabled: false
    , alpha: 1
    , menuItems: []
  }
};

/*
function raiseErrorIfNotInit(){
  if(typeof this._page === "undefined" || typeof this._actionBar === "undefined"){
    throw new Error("ActionBarWrapper is not initialized !!!");
  }
}



_options.getVisible = function() {
  raiseErrorIfNotInit.call(this);
  return this._actionBar.visible;
}

_options.setOverlay = function(value) {
  raiseErrorIfNotInit.call(this);
  this._actionBar.overlay = value;
};

_options.addMenuItem = function(params) {
  raiseErrorIfNotInit.call(this);
  if(Device.deviceOS == "Android"){
    const menuItem = new SMF.UI.MenuItem();
    this._menuItems.push();
    this._actionBar.menuItems = this._menuItems;
  }
};

_options.setVisible = function(value) {
  raiseErrorIfNotInit.call(this);
  this._actionBar.visible = value;
  if (this._page && this._page.navigationItem && value) {
    this._navigationItem = this._page.navigationItem;
  } else {
    this._navigationItem = null;
  }
};

_options.visibleToggle = function() {
   raiseErrorIfNotInit.call(this);
  this._actionBar.visible = !this._actionBar.visible;
};

_options.addButton = function() {
};

_options.setBackgroundImage = function(value) {
  this._actionBar.backgroundImage = value;
};

_options.backgroundColor = function(value) {
   raiseErrorIfNotInit.call(this);
  this._actionBar.backgroundColor = value;
};

_options.transparent = function(value) {
  raiseErrorIfNotInit.call(this);
  if (_actionBar.alpha) {
    this._actionBar.alpha = value;
  } else {
    this._actionBar.translucent = !!value;
  }
};

_options.setHideOnContentScroll = function(value) {
  raiseErrorIfNotInit.call(this);
  if(Device.deviceOS == "Android"){
    this._actionBar.hideOnContentScroll = value;
  }
};

_options.setTitleView = function(value) {
  raiseErrorIfNotInit.call(this);
  this._actionBar.titleView = value;
};

_options.setEnabled = function(value) {
  raiseErrorIfNotInit.call(this);
  this._actionBar.enabled = value;
};

_options.getEnabled = function() {
  raiseErrorIfNotInit.call(this);
  return this._actionBar.enabled;
};

_options.setTitleView = function(iosParams, androidParams) {
  raiseErrorIfNotInit.call(this);
  if (this._navigationItem) {
    this._navigationItem.titleView = iosParams;
  } else {
    this._actionBar.titleView = androidParams;
  }
};


_options.clear = function() {
  this._actionBar = null;
  this._page = null;
  this._navigationItem = null;
  this._leftButtons = [];
  
  if (_navigationItem) {
    this._navigationItem.titleView = null;
    this._navigationItem.leftBarButtonItems = [];
  } else if(_actionBar) {
    this._actionBar.menuItems = [];
    this._actionBar.titleView = null;
  }
}

_options.addLeftBarButtonItem = function(icon, props){
  var onSelected;
  if (Device.deviceOS === "iOS") {
    const btn = new SMF
      .UI
      .iOS
      .BarButtonItem({
        image : icon
      });
      
    this._leftButtons.push(btn);
    this._navigationItem.leftBarButtonItems = _leftButtons;

    return function(cb){
      btn.onSelected = cb;
    };
    
  } else {
    this._actionBar.displayShowHomeEnabled = true;
    this._actionBar.icon = icon;
    
    return function(cb){
      this._page.onHomeIconItemSelected = cb;
    };
  }
};

_options.addRightBarButtonItem = function(item){
  if (Device.deviceOS === "iOS") {
    this._rightButtons.push(item);
    this._navigationItem.rightBarButtonItems = _rightButtons;
  }
};
*/
module.exports = ActionBarWrapper;