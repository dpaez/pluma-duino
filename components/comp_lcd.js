var LCDShield = function(){
 
  var five = require('johnny-five'),
    _lcd = null,
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

    _lcd = new five.lcd({
      pins: options.pins,
      rows: options.rows,
      cols: options.cols,
    });
  };

  var _defaultAction = function( data ){
    if (!_lcd) { return; }
    
    data = data || '1,2,3...';
    
    _lcd.clear();
    _lcd.print( '>> ' );
    _lcd.setCursor( 0, 1 );
    _lcd.print( data );
    setTimeout(function(){
      _lcd.clear();
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

  // Public API
  
  var publicCreate = function( options ){
    _preStart( options );
    _create( options );
    //_postStart();
  };


  return {
    componentType: _componentType,
    componentActions : _componentActions,
    createComponent: publicCreate,
    defaultAction: _defaultAction,
    getComponentType: _getComponentType,
    getComponentActions: _getComponentActions
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
  

