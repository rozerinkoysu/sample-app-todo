const SMFConsole = require('../core/log.js');
const Rx = require('../../libs/rx.all.js');

const _changeHandler$ = new Rx.Subject();

var data = [
  {
      id: 1
    , creationDate: "01-09-2016 18:00"
    , type: "work"
    , summary: "Checkout Development"
    , desc: ""
    , isAlarmSet: false
    , alarmRule: ""
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 2
    , creationDate: "01-09-2016 18:00"
    , type: "hobby"
    , summary: "Lunch with Tony"
    , desc: ""
    , isAlarmSet: false
    , alarmRule: ""
    , isDeleted: false
    , status: "completed"
  }
  , {
      id: 3
    , creationDate: "01-09-2016 18:00"
    , type: "hobby"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 4
    , creationDate: "01-09-2016 18:00"
    , type: "shopping"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 5
    , creationDate: "01-09-2016 18:00"
    , type: "work"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 6
    , creationDate: "01-09-2016 18:00"
    , type: "hobby"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "completed"
  }
  , {
      id: 7
    , creationDate: "01-09-2016 18:00"
    , type: "hobby"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 8
    , creationDate: "01-09-2016 18:00"
    , type: "hobby"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "completed"
  }
  , {
      id: 9
    , creationDate: "01-09-2016 18:00"
    , type: "shopping"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 10
    , creationDate: "01-09-2016 18:00"
    , type: "sport"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 11
    , creationDate: "01-09-2016 18:00"
    , type: "sport"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "idle"
  }
  , {
      id: 12
    , creationDate: "01-09-2016 18:00"
    , type: "shopping"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "completed"
  }
  , {
      id: 13
    , creationDate: "01-09-2016 18:00"
    , type: "family"
    , summary: "Shopping for dinner"
    , desc: ""
    , isAlarmSet: true
    , alarmRule: "01-09-2016 17:00"
    , isDeleted: false
    , status: "completed"
  }
];

data.reverse();

const TodoStore = function() {
};

TodoStore.findById = function(id) {
  return data.filter(function(todo){ return todo.id == id })[0] || null;
}

TodoStore.findByStatus = function() {
};

// Returns copy of last week tasks that they are not deleted by user.
TodoStore.find = function(finder) {
  return finder(data).filter(filterByProp("isDeleted", false, "eq"));
};

TodoStore.findByDate = function(date, condition) {
  return function(data){
    return copyof(data);
  }
};

TodoStore.findByType = function(type) {
  return function(data){
    return copyof(
      data
        .filter(filterByProp("type", type, "eq"))
        );
  }
};

TodoStore.findByStatus = function(status) {
  return function(data){
    return copyof(
      data
        .filter(filterByProp("status", status, "eq"))
        );
  };
};

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

TodoStore.add = function(newData) {
  newData = Object.assign({}, newData);

  newData.id = data.length;
  newData.status = "idle";
  newData.isDeleted = false;

  data = [newData].concat(data);
  
  _changeHandler$.onNext();
  
  // debug(data);
  return newData.id;
};

TodoStore.changeHandler$ = function(){
  return _changeHandler$.share();
};

TodoStore.deleteTask = function(id){
  updateTask({id: id, isDeleted: true});
};

TodoStore.save = function(update) {
  updateTask(update);
};

TodoStore.completeTask = function(id){
  updateTask({id: id, status: "completed"});
};

const sortBy = function(propName){
  return data.reduce(function(prev, curr, i){
    if(prev.length > 0){
      
    }
    prev = [curr].concat(prev);
    return prev;
  }, []);
}

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