const SMFConsole = require('../core/log.js');
const Rx         = require('../../libs/rx.all.js');
const moment     = require("../../libs/moment.js");

const _changeHandler$ = new Rx.Subject();

var data = [
  {
      id: 1
    , creationDate: moment().add(5,'hours') // "20-09-2016 19:30"
    , completionDate: ""
    , type: "shopping"
    , summary: "Get groceries from the store"
    , desc: ""
    , isAlarmSet: false
    , alarmRule: ""
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 2
    , creationDate: moment().subtract(2,'weeks').toString()
    , completionDate: moment().subtract(1,'week').toString()
    , type: "work"
    , summary: "Read Smartface University Module 5"
    , desc: ""
    , isAlarmSet: false
    , alarmRule: ""
    , isDeleted: false
    , status: "completed"
  }
  , {
      id: 3
    , creationDate: moment().add(1,'days').add(1,'hours').add(19,'minutes').subtract(2, "weeks").toString()
    , type: "family"
    , summary: "Dentist’s appointment"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: moment().add(1, "w").set("hour", 12).set("minute", 15).toString()
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 4
    , creationDate: moment().add(3,'days').add(9,'hours').add(51,'minutes').subtract(3, "weeks").toString()
    , type: "work"
    , summary: "Book flight tickets to SF"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: moment().add(1, "w").set("hour", 12).set("minute", 15).toString()
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 5
    , creationDate: moment().subtract(1,'hours').add(33,'minutes').toString()
    , type: "payment"
    , summary: "Get some gifts for holidays"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: moment().add(1, "w").set("hour", 12).set("minute", 15).toString()
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 6
    , creationDate: moment().subtract(4,'days').add(1,'hours').add(33,'minutes').toString()
    , completionDate: moment().subtract(1,'days').toString()
    , type: "hobby"
    , summary: "Follow-up mobile app development project"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: moment().add(1, "d").set("hour", 10).set("minute", 30).toString()
    , isDeleted: false
    , status: "completed"
  }
  , {
      id: 7
    , creationDate: moment().subtract(7,'days').subtract(3,'hours').subtract(12,'minutes').toString()
    , completionDate: moment().subtract(3,'days').toString()
    , type: "shopping"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: moment().set("hour", 16).set("minute", 45).toString()
    , isDeleted: false
    , status: "completed"
  }
];

data.reverse();

/**
 * Todo data store
 * 
 * @namespace
 */
const TodoStore = function() {
};

/**
 * Filters data by id
 * 
 * @return {Array}
 */
TodoStore.findById = function(id) {
  return data.filter(function(todo){ return todo.id == id })[0] || null;
};

/**
 * Returns data by filter
 * 
 * @return {Array}
 */
TodoStore.find = function(finder) {
  return finder(data).filter(filterByProp("isDeleted", false, "eq"));
};

/**
 * Filters data by last week
 * @return {Array}
 * 
 * @returns {Array}
 */
TodoStore.findByLastWeek = function(fieldName) {
  return function(data){
    return data
        .filter(function(data){
          return data[fieldName]
            && moment().diff(moment(data[fieldName]), "weeks") == 0;
          // moment(data.completionDate).subtract()
        })
  };
};

/**
 * Filters data by last month
 *
 * @return {Array}
 */
TodoStore.findByLastMonth = function(fieldName) {
  return function(data){
    return data
        .filter(function(data){
          return data[fieldName]
            && moment().diff(moment(data[fieldName]), "months") == 0;
          // moment(data.completionDate).subtract()
        })
  };
};

/**
 * Filters data by type
 *
 * @returns {Array}
 */
TodoStore.findByType = function(type) {
  return function(data){
    return copyof(
      data
        .filter(filterByProp("type", type, "eq"))
        );
  };
};

/**
 * Filters data by status
 *
 * @returns {Array}
 */
TodoStore.findByStatus = function(status) {
  return function(data){
    return copyof(
      data
        .filter(filterByProp("status", status, "eq"))
        );
  };
};

/**
 * Groups data by property name
 *
 * @returns {Array}
 */
TodoStore.groupByPropName = function(propName){
  return function(data){
    return data
        .reduce(function(prev, curr){
          if(!prev[curr[propName]]){
            prev[curr[propName]] = [];
          }
          
          prev[curr[propName]].push(curr);
          
          return prev;
        }, []);
  };
};

/**
 * Adds new data and returns id
 *
 * @returns {number}
 */
TodoStore.add = function(newData) {
  const initialData = {
      alarmRule: ""
    , isAlarmSet: false
  }
  
  newData = Object.assign(initialData, newData);

  newData.id           = data.length;
  newData.status       = "idle";
  newData.isDeleted    = false;
  newData.creationDate = moment().toString();

  data = [newData].concat(data);
  
  _changeHandler$.onNext();
  
  return newData.id;
};

/**
 * Returns change handler stream
 *
 * @returns {Rx.Observable}
 */
TodoStore.changeHandler$ = function(){
  return _changeHandler$.share();
};

/**
 * Deletes data from store by id
 *
 */
TodoStore.deleteTask = function(id){
  updateTask({id: id, isDeleted: true});
};

/**
 * saves an existing data
 *
 */
TodoStore.save = function(update) {
  updateTask(update);
};

/**
 * Updates data status to 'completed'
 *
 */
TodoStore.completeTask = function(id){
  updateTask({id: id, status: "completed", completionDate: moment().toString()});
};

// const sortBy = function(propName){
//   return data.reduce(function(prev, curr, i){
//     if(prev.length > 0){
      
//     }
//     prev = [curr].concat(prev);
//     return prev;
//   }, []);
// }

const updateTask = function(update){
  if(typeof update.id === "undefined"){
    SMFConsole.log("[Warning] [TodoStore] update data's id is undefined");
    return false;
  }
  
  return data.some(function(task, i){
    if(task.id === update.id){
      data[i] = Object.assign(task, update);
      _changeHandler$.onNext();
      return true;
    }
  });
};

function copyof(objCollection){
  return objCollection.map(function(item){
    return Object.assign({}, item);
  });
}

function filterByProp(propName, value, condition){
  return function(task){
    return applyCondition(value, task[propName], condition);
  };
};

function applyCondition(value1, value2, operator) {
  switch(operator){
    case "ge":
      return value1 >= value2;
      break;
    case "gt":
      return value1 > value2;
      break;
    case "eq":
      return value1 == value2;
      break;
    case "le":
      return value1 <= value2;
      break;
    case "lt":
      return value1 < value2;
      break;
    default:
      throw new Error(`[TodoStore][filterByCondition] Condition key [${operator}] is invalid.`);
      break;
  }
}

module.exports = TodoStore;