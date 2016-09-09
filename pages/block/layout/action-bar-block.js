// const Component = require("../../app/core/component.js");
const ActionBarWrapper = require("../../../app/core/action-bar.js");
const Rx               = require("../../../libs/rx.all.js");
const SMFConsole       = require("../../../app/core/log.js");

const ActionBarBlock = function(page){
  ActionBarWrapper.clear();
  ActionBarWrapper(page);
};

ActionBarBlock.defaultBar = function(){
  try{


    return {
      sliderMenuIconClick$: sliderMenuIconClick$
    };
    
  } catch(e) {
    SMFConsole.error("ActionBarBlock", e);
  }
};

module.exports = ActionBarBlock;