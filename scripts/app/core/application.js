/* globals */

const _applicationItems = [];

function getRequirements(klass){
  return klass["$inject"].map(function(itemName){
    return _applicationItems[itemName];
  });
}

/**
 * @class
 * @ignore
 */
const Application = function(){
  
}

Application.register = function(name, klass, isSingleton){
  _applicationItems[name] = klass;
}

Application.get = function(name){
  const klass = _applicationItems[name];
  
  return new klass.constructor.apply(null, getRequirements(klass));
}