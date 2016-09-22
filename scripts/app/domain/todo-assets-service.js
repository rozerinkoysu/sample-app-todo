const SMFConsole = require("../core/log.js");

const icons = {
    shopping: ["shopping_white.png", "shopping_dark.png", "shopping.png"]
  , payment: ["payment_white.png", "payment_dark.png", "payment.png"]
  , family: ["family_white.png", "family_dark.png", "family.png"]
  , friends: ["friends_white.png", "friends_dark.png", "friends.png"]
  , work: ["new_work.png", "work.png", "work.png"]
  , sport: ["sport_white.png", "sport_dark.png", "sport.png"]
  , hobby: ["hobby_white.png", "hobby_dark.png", "hobby.png"]
  , others: ["others_white.png", "others_dark.png", "others.png"]
};

/**
 * Manages related ui assets of Todo
 * 
 * @namespace
 */
const TaskAssetsService = {
};

/**
 * Assets names
 * 
 * @enum
 */
TaskAssetsService.names = {
    shopping: "shopping"
  , payment: "payment"
  , family: "family"
  , friends: "friends"
  , work: "work"
  , sport: "sport"
  , hobby: "hobby"
  , others: "others"
};

/**
 * Assets thresholds
 * 
 * @enum
 */
TaskAssetsService.types = {black: 1, white: 0, normal: 2};

function raiseErrorIfNameIsNotFound(name, type) {
  if(!TaskAssetsService.names[name] || !name){
    SMFConsole.error(`[TaskAssetsService] Given name [ ${name} ] is not found`);
    return true;
  } else if(!icons[name][type]) {
    SMFConsole.error(`[TaskAssetsService] Given type [ ${type} ] is not found`);
    return true;
  }
  
  return false;
}

/**
 * Returns all icons' names by type
 *
 * @return {Array<{name:{string}, image:{string}}>}
 */
TaskAssetsService.getAllIconsByType = function(type){
  return Object.keys(icons).map(function(key){
    return {name: key, image:TaskAssetsService.getIcon(key, type)};
  })
}

/**
 * Returns icon name by threshold and name
 *
 * @return {Array<{name:{string}, image:{string}}>}
 */
TaskAssetsService.getIcon = function(name, type) {
  if(!raiseErrorIfNameIsNotFound(name, type)){
    return icons[name][type];
  }
  return "";
};

module.exports = TaskAssetsService;