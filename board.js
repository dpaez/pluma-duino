'use strict';

var five = require('johnny-five'),
    sio = require('socket.io'),
    board = new five.Board(),
    io = sio.listen(8080);

var _boardSetup = function(board, options){
  // pinMode setup
  if ( (options.pinMode) && (typeof options.pinMode === 'object') ){
    for ( var pin in options.pinMode ){
      if ( (typeof pin === 'number') && (Array.isArray(options.pinMode[pin])) ){
        // complex pin setup
        var subArray = options.pinMode[pin];
        for ( var i = 0; i < subArray.length; i++ ){
          board.pinMode( pin, subArray[i] );
        }
      }else{
        // simple/regular pin setup
        board.pinMode( pin, options.pinMode[pin] );
      }
    }
  }
  // do more setup below
  // ...
};

/*
  This should be part of a different module, like board.types.js
 */
var boardTypes = {
  motor: function( options ){
    options = options || {};
    return new five.Motor( options );
  },
  servo: function( options ){
    options = options || {};
    return new five.Servo( options );
  },
  led: function( options ){
    options = options || {};
    return new five.Led( options );
  },
  lcd: function( options ){
    options = options || {};
    return new five.LCD( options );
  }
};

/**
 * [_create Create an Arduino new component wich will be attached to a board instance.]
 * @param  {String} type [a valid component type]
 * @return {Object}      [An Arduino component instance. ]
 */
var _create = function( componentType ){
  if ( boardTypes.hasOwnProperty(componentType) ){
    return boardTypes[componentType];
  }
  return undefined;
};

board.on('ready', function() {

  // hardcode: testing purposes only
  _boardSetup(this, { pinMode: {10: [five.Pin.OUTPUT, five.Pin.INPUT]} });

  var component = _create('led');

  // TODO: component.on('ready', init());


  // Create some J5 HW module
  // e.g: var motor = new five.motor()
  // And pass it selected module pins as options
  // Abstract this creation process and exposes it
  // through websockets so new modules can be
  // attached to board on-the-fly via Pluma app.

});