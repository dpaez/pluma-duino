'use strict';
var Vibro = function(){

  var five = require('johnny-five'),
    _component = null,
    _componentType = 'vibro',
    _componentActions = 'defaultAction';

  var _preStart = function( options ){

  };

  var _create = function( options ){
    if ( !options ) { return; }

    _component = new five.Motor({
      pin: options.pin,
    });

    return _component;
  };

  var _defaultAction = function( componentInstance, data ){
    if ( !componentInstance ) { return; }

    componentInstance.start();

    // Demonstrate motor stop in 2 seconds
    setTimeout(function(){
      componentInstance.stop();
    },2000)
  };


  // Public API

  var publicCreate = function( options ){
    _preStart( options );
    var instance = _create( options );
    //_postStart();
    return instance;
  };

  var _getComponentType = function(){
    return _componentType;
  };

  var _getComponentActions = function(){
    // TODO: improve this.. actions hash or array or ??
    // component could easily have more than one action
    return _componentActions;
  };

  return {
    componentType: _componentType,
    componentActions : _componentActions,
    createComponent: publicCreate,
    defaultAction: _defaultAction,
    getComponentType: _getComponentType,
    getComponentActions: _getComponentActions,
  };
};

module.exports = new Vibro();