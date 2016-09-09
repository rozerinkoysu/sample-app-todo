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

const TaskAssetsService = {
};

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

TaskAssetsService.types = {black: 1, white: 0, normal: 2};

TaskAssetsService.getAllIconsByType = function(type){
  return Object.keys(icons).map(function(key){
    return {name: key, image:TaskAssetsService.getIcon(key, type)};
  })
}

TaskAssetsService.getIcon = function(name, type) {
  if(!raiseErrorIfNameIsNotFound(name, type)){
    return icons[name][type];
  }
  return "";
};

module.exports = TaskAssetsService;