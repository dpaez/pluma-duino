'use strict';
var Vibro = function(){

  var five = require('johnny-five'),
    log = require('npmlog'),
    _component = null,
    _componentType = 'vibro',
    _componentActions = 'defaultAction',
    _interval;

  var _preStart = function( options ){

  };

  var _create = function( options ){
    if ( !options ) { return; }

    var _options = {};
    if ( options.pin ){
      _options.pin = options.pin;
    }else if ( options.pwm ){
      _options.pins = options.pwm;
      if ( options.dir ){ _options.dir = options.dir; }
      if ( options.brake ){ _options.brake = options.brake; }
    }
    _component = new five.Motor( _options );

    return _component;
  };

  /**
   * [_preAction prepare parameters for _defaultAction fn]
   * @param  {[type]} componentInstance [REQUIRED]
   * @param  {[type]} data              [REQUIRED]
   * @param  {[type]} filters           [OPTIONAL]
   * @param  {[type]} _defaultAction    [NEXT FN]
   * @return {[type]}                   [description]
   */
  var _preAction = function( componentInstance, data, filters, _defaultAction ){
    var instant, power, regular;

    if ( !filters ){
      _defaultAction(componentInstance, data);
      return;
    }

    if ( filters.instantFilter ){
      log.info( '\t>>', 'Delay set to: %s \n', filters.instantFilter );
      instant = filters.instantFilter;
      //setTimeout( function(){_defaultAction( componentInstance, data )}, (Number(filters.instantFilter) * 1000) );
    }

    if ( filters.powerFilter ){
      log.info( '\t>>', 'Power speed set to: %s \n', filters.powerFilter );
      power = filters.powerFilter;
      //_defaultAction(componentInstance, data, filters.powerFilter);
    }

    if ( filters.continousFilter ){
      log.info( '\t>>', 'Continous is enabled.\n' );
      regular = true;
      //_interval = setInterval( function(){_defaultAction(componentInstance, data)}, (Number(filters.continousFilter) * 1000));
    }

    if ( filters.discreteFilter ){
      log.info( '\t>>', 'Discrete is enabled.\n' );
      regular = false;
      //_defaultAction(componentInstance, data);
    }
    _defaultAction( componentInstance, data, instant, power, regular );
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


  var _defaultAction = function( componentInstance, data, instant, power, regular ){
    if ( !componentInstance ) { return; }

    // This value should be passed by the user in the future
    var regularValue = 3000; // 3 seconds delay as a default

    var scalePower = function( value, originalMin, originalMax, scaleMin, scaleMax ){
      return ( (scaleMax - scaleMin) * (value - originalMin) ) / ( originalMax - originalMin );
    }
    // default values
    instant = instant || 1;
    //power = power || 5;
    //power = scalePower( power, 1, 10, 60, 255 );

    if ( power <= 60 ){
      power = 60; // MIN - tested against vibro motors, values under 60 are not noticed.
    }else if (power > 255){
      power = 255; // MAX
    }

    regular = regular || false;

    if ( regular ){
      _interval = setInterval( function(){
        setTimeout(function(){ componentInstance.start( Number(power) ) }, ( Number(instant) * 1000 ))
      }, regularValue );
    }else{
      setTimeout( function(){ componentInstance.start( Number(power) ) }, ( Number(instant) * 1000 ));
      // Demonstrate motor working... Stop in 2 seconds
      setTimeout(function(){
        componentInstance.stop();
      }, 2000 );
    }

  };

  var _stop = function( componentInstance, data, filters ){

    filters = filters || {};

    if ( filters.continousFilter ){
      clearInterval( _interval );
    }
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
    defaultAction: _action,
    stop: _stop,
    getComponentType: _getComponentType,
    getComponentActions: _getComponentActions,
  };
};

module.exports = new Vibro();