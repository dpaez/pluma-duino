'use strict';

var five = require('johnny-five'),
    sio = require('socket.io'),
    board = new five.Board(),
    io = sio.listen(8080),
    component;

function _boardSetup(board, options){
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
}

/*
  This should be part of a different module, like board.types.js
 */
var boardTypes = {
  'motor': function(){
    return five.Motor();
  },
  'servo': function(){
    return five.Servo();
  },
  'led': function(){
    return five.Led();
  },
  'lcd': function(){
    return five.LCD();
  }
};

/**
 * [_create Create an Arduino new component wich will be attached to a board instance.]
 * @param  {String} type [a valid component type]
 * @return {Object}      [An Arduino component instance. ]
 */
function _create( componentType, options ){
  if ( boardTypes.hasOwnProperty(componentType) ){
    return new boardTypes[componentType]( options );
  }
  return undefined;
}

function _getNewComponent( componentType, options ){
  options = options || {};
  switch( componentType ){
    case 'motor':
      return new five.Motor( options );
      break;
    case 'lcd':
      return new five.LCD( options );
      break;
    default:
      return undefined;
      break;
  }
}

function do_default( data ){
  // hardc0de: every kind of component should have a do_default action
  component.clear();
  component.print( '>> ' );
  component.setCursor( 0, 1 );
  component.print( data );
}

board.on('ready', function() {

  // component = _create( 'lcd' );

  io.sockets.on('connection', function( socket ){

    socket.on('plumaduino:board_status', function(){
      socket.emit( 'plumaduino:board_ready' );
    });

    socket.on('plumaduino:board_setup', function( config ){
      // hardc0de: testing purposes only
      _boardSetup( board, { pinMode: {10: [five.Pin.OUTPUT, five.Pin.INPUT]} } );
    });

    socket.on('plumaduino:create_component', function( type ){
      var options = {
        pins: [ 8, 9, 4, 5, 6, 7 ],
        rows: 2,
        cols: 16,
      };

      component = _getNewComponent( type, options );

      component.on( 'ready', function(){ socket.emit( 'plumaduino:component_ready', {componentType: type} ); } );
    });

    socket.on('plumaduino:execute_default', function( data ){
      do_default( data );
    });

    socket.on('plumaduino:component-do', function( data ){
      
      if !(data) { return; }

      // get instantiated component first
      // component = _getComponent( data.type );
      // if component ...
      // component[ data.action ]();

    });

  });

});