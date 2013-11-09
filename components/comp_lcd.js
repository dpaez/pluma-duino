'use strict';
var LCDShield = function(){

  var five = require('johnny-five'),
    _component = null,
    _componentType = 'lcd',
    _componentActions = 'defaultAction';

  /**
   * [_preStart Actions to be done before component creation. Usually some boards setup]
   * @param  {Object} options
   *
   */
  var _preStart = function( options ){
    if ( !options.board ){ return; }

    options.board.pinMode( 10, five.Pin.OUTPUT );
    options.board.pinMode( 10, five.Pin.INPUT );

  };

  var _create = function( options ){
    if ( !options ) { return; }

    _component = new five.LCD({
      pins: options.pins,
      rows: options.rows,
      cols: options.cols,
    });

    return this;
  };

  var _defaultAction = function( data ){
    if (!_component) { return; }

    data = data || '1,2,3...';

    _component.clear();
    _component.print( '>> ' );
    _component.setCursor( 0, 1 );
    _component.print( data );
    setTimeout(function(){
      _component.clear();
    }, 3000);
  };

  var _getComponentType = function(){
    return _componentType;
  };

  var _getComponentActions = function(){
    // TODO: improve this.. actions hash or array or ??
    // component could easily have more than one action
    return _componentActions;
  };

  var _getComponent = function(){
    return _component;
  };

  // Public API

  var publicCreate = function( options ){
    _preStart( options );
    var instance = _create( options );
    //_postStart();
    return instance;
  };

  // TODO: This can and must be better done.
  // this.componentType = _componentType;
  // this.componentActions = _componentActions;

  // this.prototype = {
  //   createComponent: publicCreate,
  //   defaultAction: _defaultAction,
  //   getComponentType: _getComponentType,
  //   getComponentActions: _getComponentActions,
  //   getComponent: _getComponent,
  // };

  // return this;

  return {
    componentType: _componentType,
    componentActions : _componentActions,
    createComponent: publicCreate,
    defaultAction: _defaultAction,
    getComponentType: _getComponentType,
    getComponentActions: _getComponentActions,
    getComponent: _getComponent,
  };

};

module.exports = new LCDShield();

// var lsd = require('./components/comp_lcd');
// var l.... = lsd.create( opts );
// inside board...
  // l.defaultAction();

// VS
//
// var LSD = require('./components/comp_lcd');
// var lcd = new LSD( opts );
// inside board...
  // l.defaultAction();


