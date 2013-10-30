var Servo = function(){

  var five = require('johnny-five'),
    _component = null,
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

    _component = new five.Servo({
      pin: options.pin,
    });
    
    return this;
  };

  var _defaultAction = function( data ){
    if (!_component) { return; }

    _component.move( 90 );

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
    _create( options );
    //_postStart();
    return this;
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

  // TODO: create a wrapper object so these comp_* could inherit from and define on it those (below) common actions
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

module.exports = new Servo();