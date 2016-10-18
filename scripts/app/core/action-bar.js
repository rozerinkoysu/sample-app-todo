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

/**
 * NullObject pattern implementation
 * 
 * @class
 */
const NullProperty = function(){
};

/**
 * Proxies to native actionbar component of andriod
 * 
 * @class
 */
const AndroidProxy = function(actionBar){
  return {
    /**
     * If specified prop name exists, returns true else false
     * 
     * @returns {boolean}
     */
    hasProp: function(prop){
      return !(this.get(prop) instanceof NullProperty);
    },
    /**
     * Rerturns specified prop name exists then returns its value
     * 
     * @returns {}
     */
    get: function(prop){
      if(actionBar.hasOwnProperty(prop)){
        return actionBar[prop];
      }

      return new NullProperty();
    }
    /**
     * If specfied props name exists then assings value
     *
     * @returns {(NullProperty|{})}
     */
    , set: function(prop, value){
      if(actionBar.hasOwnProperty(prop)){
        return actionBar[prop] = value;
      } 

      return new NullProperty();
    }
  };
};

/**
 * Proxies to native nvigationbar component of ios
 * 
 * @class
 */
const iOSProxy = function(navigationBar, page){
  return {
    /**
     * If specified prop name exists, returns true else false
     * 
     * @returns {boolean}
     */
    hasProp: function(prop){
      return navigationBar.hasOwnProperty(prop) 
        || (page.navigationItem && page.navigationItem.hasOwnProperty(prop));
    }
    /**
     * Rerturns specified prop name exists then returns its value
     * 
     * @returns {}
     */
    , get: function(prop){
      if(navigationBar.hasOwnProperty(prop)){
        return navigationBar[prop];
      } else if(page.navigationItem && page.navigationItem.hasOwnProperty(prop)){
        return page.navigationItem[prop];
      } 

      return new NullProperty();
    }
    /**
     * If specfied props name exists then assings value
     *
     * @returns {(NullProperty|{})}
     */
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

/**
 * Helper method is to run proxy on android
 * 
 * @static
 * @function
 */
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

/**
 * Helper method is to run proxy on ios
 * 
 * @static
 * @function
 */
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

/**
 * Helper method is to run proxies by available device OS.
 * 
 * @function
 * @returns {}
 */
const ActionBarWrapper = function(page, options) {
  options = Object.assign({}, options);
  
  if (Device.deviceOS === "Android") {
    return runOnAndroid(page, options);
  } else {
    return runOniOS(page, options);
  }
};

/**
 * Default Action and Navigationbar options
 * 
 * @static
 */
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

module.exports = ActionBarWrapper;