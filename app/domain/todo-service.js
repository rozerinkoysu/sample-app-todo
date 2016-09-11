/* globals */
const moment = require('../../libs/moment.js');

const TodoService = {};

TodoService.dateToCalendarText = function(date){
  const res = moment(date).calendar(null, {
      sameDay: '[Today] HH:mm',
      nextDay: '[Tomorrow] HH:mm',
      nextWeek: 'dddd HH:mm',
      lastDay: '[Yesterday] HH:mm',
      lastWeek: '[Last]',
      sameElse: 'DD/MM/YYYY HH:mm'
    });
    
  return res;
};

TodoService.setLocalNotification = function(date, body, action){
  var localNotification = new Notifications.LocalNotification({
      id: 1
    , alertTitle : action
    , smallIcon : "bell.png"
    , fireDate: new Date(date)
    , alertBody: body
  });
  
  Notifications.local.scheduleNotification(localNotification);
}

TodoService.cancelLocalNotification = function(date, body, action){
  var localNotification = new Notifications.LocalNotification({
      fireDate: new Date(date)
    , alertBody: body
    , alertAction: action // iOS only
  });
  
  Notifications.local.cancelNotification(localNotification);
}


module.exports = TodoService;