const Component = require("../../app/core/component.js");
const Rx = require("../../libs/rx.all.js");
const moment = require("../../libs/moment.js");
const TodoService = require("../../app/domain/todo-service.js");
const SMFConsole = require("../../app/core/log.js");

const SetAlarmRule = function(params, rule, isEditable){
  isEditable = !!isEditable;
  
  params = Object.assign(
      params
    , {
        layoutType: SMF.UI.LayoutType.FLOW
      , fillColor: "#000000"
    });
  
  Component.apply(this, [params]);
  
  const alarmEdit = function(){
    SMFConsole.log("on touch");
    const _changeState = changeState.bind(this);
    SMF.UI.showDatePicker({
      currentDate : (new Date()).toString(), // date is given with JavaScript date object
      mask : "dd-MM-yyyy",
      minDate : new Date(),
      maxDate : new Date("13 October, 2025"),
      showWorkingDate : true,
      onSelect : function (e) {
        const selectedDate = e.date;
        SMF.UI.showTimePicker({
          currentTime : "07:00",
          hourViewFormat24 : true,
          minuteInterval : 5,
          minTime : "00:00",
          maxTime : "23:59",
          onSelect : function (e) {
            var t = new Date(e.time);
            var date = moment(selectedDate)
                .set("hour", t.getHours())
                .set("minute", t.getMinutes())
                .toString()
            
            _changeState(date);
            changeHandler$.onNext(date)
          },
          onCancel : function () {
            // _changeState = null;
          }
        });        
      },
      onCancel : function (e) {
        // _changeState = null;
      }
    });
  };

  const changeHandler$ = new Rx.Subject();
  
  const alarmIcon = new SMF.UI.Image({
      width: "10%"
    , height: "100%"
    , touchEnabled: false
  });
  
  const arrow  = new SMF.UI.Image({
      width: "10%"
    , height: "100%"
    , touchEnabled: false
  });
  
  const lbl = new SMF.UI.Label({
      height: "100%"
    , touchEnabled: false
  });
  
  const changeState = function(rule, isEditable) {
    isEditable = !!isEditable;
    alarmIcon.image = rule ? "bell_detail" : "add_new_bell.png";
    arrow.image     = rule ? "Submit_detail.png" : "Submit.png";
    lbl.text        = rule ? TodoService.dateToCalendarText(rule) : "Add Reminder";
    lbl.fontColor   = rule ? "#33C06F" : "#8F8F8F";
    
    this._view.onTouch = isEditable ? alarmEdit.bind(this) : function(){};
  };
  
  
  this.setProps = function(rule, isEditable) {
    changeState.apply(this, [rule, isEditable]);
  };
  
  this.onChange = function() {
    return changeHandler$.share();
  };
  
  changeState.apply(this, [rule, isEditable]);
  
  this.add(alarmIcon);
  this.add(lbl);
  this.add(arrow);
  
};

SetAlarmRule.prototype = Object.create(Component.prototype);

module.exports = SetAlarmRule;