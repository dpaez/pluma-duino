'use strict';
var Servo = function(){

  var five = require('johnny-five'),
    //_component = null,
    _componentType = 'servo',
    _componentActions = 'defaultAction';


  /**
   * [_preStart Actions to be done before component creation. Usually some boards setup]
   * @param  {Object} options
   *
   */
  var _preStart = function( options ){

  };

  var _create = function( options ){
    if ( !options ) { return; }

    var _component = new five.Servo({
      pin: options.pin,
    });

    return _component;
  };

  var _defaultAction = function( componentInstance, data ){
    if ( !componentInstance ) { return; }
    data = data || 90;

    componentInstance.move( data );

    setTimeout(function(){
      componentInstance.center();
    },2000);

  };

  var _getComponentType = function(){
    return _componentType;
  };

  var _getComponentActions = function(){
    // TODO: improve this.. actions hash or array or ??
    // component could easily have more than one action
    return _componentActions;
  };

  // DEPRECATED
  // var _getComponent = function(){
  //   return _component;
  // };

  // Public API

  var publicCreate = function( options ){
    _preStart( options );
    var instance = _create( options );
    //_postStart();
    return instance;
  };

  // TODO: create a wrapper object so these comp_* could inherit from and define on it those (below) common actions
  return {
    componentType: _componentType,
    componentActions : _componentActions,
    createComponent: publicCreate,
    defaultAction: _defaultAction,
    getComponentType: _getComponentType,
    getComponentActions: _getComponentActions,
    //getComponent: _getComponent,
  };

};

module.exports = new Servo();