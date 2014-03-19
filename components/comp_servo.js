'use strict';
var Servo = function(){

  var five = require('johnny-five'),
    //_component = null,
    _componentType = 'servo',
    _componentActions = 'defaultAction',
    _interval;


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

  /**
   * [_preAction description]
   * @param  {[type]} componentInstance [REQUIRED]
   * @param  {[type]} data              [REQUIRED]
   * @param  {[type]} filters           [OPTIONAL]
   * @param  {[type]} _defaultAction    [NEXT FN]
   * @return {[type]}                   [description]
   */
  var _preAction = function( componentInstance, data, filters, _defaultAction ){

    filters = filters || {};

    if ( !filters ){
      _defaultAction(componentInstance, data, filters);
    }

    if ( filters.instantFilter ){
      setTimeout(function(){}, filters.instantFilter );
    }

    if ( filters.powerFilter ){
      console.log( 'TODO: adjust power value to: ', filters.powerFilter );
    }

    if ( filters.continousFilter ){
      _interval = setInterval( _defaultAction(componentInstance, data, filters), filters.continousFilter );
    }

    if ( filters.discreteFilter ){
      _defaultAction(componentInstance, data, filters);
    }

    return;
  };


  /**
   * [_action description]
   * @param  {[type]} componentInstance [REQUIRED]
   * @param  {[type]} data              [REQUIRED]
   * @param  {[type]} filters           [OPTIONAL]
   * @return {[type]}                   [description]
   */
  var _action = function( componentInstance, data, filters ){
      _preAction( componentInstance, data, filters, _defaultAction );
  };

  var _defaultAction = function( componentInstance, data ){
    if ( !componentInstance ) { return; }
    data = data || 90;

    componentInstance.move( data );

    setTimeout(function(){
      componentInstance.center();
    },2000);

  };

  var _stop = function( componentInstance, data, filters ){

    filters = filters || {};

    if ( filters.continousFilter ){
      clearInterval( _interval );
    }

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
    defaultAction: _action,
    stop: _stop,
    getComponentType: _getComponentType,
    getComponentActions: _getComponentActions,
    //getComponent: _getComponent,
  };

};

module.exports = new Servo();