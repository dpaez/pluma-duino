'use strict';

var _types = {},
  _actions = {};

//module.exports = exports = AbstractComponentFactory;

var getAllTypes = function(){
  return _types;
};

var getAllActions = function(){
  return _actions;
};

var getComponent = function( componentType ){
  // Check this...
  var ComponentModule = _types[ componentType ];
  return ( (ComponentModule)? ComponentModule : undefined );
};

var registerComponent = function( Component ){
  var proto = Component;

  if ( proto.defaultAction && proto.getComponentType &&
    proto.getComponentActions && proto.createComponent ){
    _types[ Component.componentType ] = Component;
  }else{
    throw 'Missing API required methods';
  }

  return Component.componentType;
};


module.exports.getComponent = getComponent;
module.exports.registerComponent = registerComponent;