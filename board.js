'use strict';

var util = require('util'),
    five = require('johnny-five'),
    SIO = require('socket.io'),
    Builder = require('./lib/builder'),
    board = new five.Board(),
    io = SIO.listen(8080),
    _components = [],
    _state = '',
    component,
    builder;

// DEPRECATED
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

// DEPRECATED
function _getNewComponent( componentType, options ){
  options = options || {};
  switch( componentType ){
    case 'motor':
      return new five.Motor( options );
      break;
    case 'servo':
      return new five.Servo( options );
      break;
    case 'lcd':
      return new five.LCD( options );
      break;
    default:
      return undefined;
      break;
  }
}

function _prepare( components ){

  util.log( 'calling _prepare' );

  if ( components ){
    _components = components;  
  }

  _state = 'components_attached';
  
 }

board.on('ready', function() {
  
  builder = new Builder({
    ready: _prepare
  });
  
  // DEPRECATED
  // Component default functionality (hardcoded for lcd shield)
  function do_lcd( component, data ){
    if (!component) { return; }
    // hardc0de: every kind of component should have a do_default action
    component.clear();
    component.print( '>> ' );
    component.setCursor( 0, 1 );
    component.print( data );
    setTimeout(function(){
      component.clear();
    }, 3000);
  }

  // DEPRECATED
  function do_servo( component, data ){
    if (!component) { return; }

    component.sweep();

    board.wait(5000, function(){
      component.stop();
      component.center();
    });
  }

  io.sockets.on('connection', function( socket ){

    // change this for a callback fn added to Builder creation or think for something else
    // builder.on('builder:ready', function( components ){
    //   _components = components;
    //   //socket.emit( 'plumaduino:components_attached', components );
    // });

    socket.on('plumaduino:board_status', function(){
      // stupid app/board syncro event
      socket.emit( 'plumaduino:board_ready' );
      if ( _state === 'components_attached' ){
        socket.emit( 'plumaduino:components_attached', _components );
      }
    });

    // DEPRECATED
    socket.on('plumaduino:board_setup', function( config ){
      // hardc0de: testing purposes only
      _boardSetup( board, { pinMode: {10: [five.Pin.OUTPUT, five.Pin.INPUT]} } );
    });

    socket.on('plumaduino:create_component', function( data ){

      if ( !data ) { return; }

      // NEW:
      component = builder.getComponent( data.type, data.options );
      // component = _getNewComponent( data.type, data.options );

      var componentInstance = component.getComponent();
      componentInstance.on( 'ready', function(){ socket.emit( 'plumaduino:component_ready', {componentType: data.type} ); } );
    });

    socket.on('plumaduino:component_do', function( data ){

      if (!data) { return; }

      data.params = ( data.params ) ? data.params : {};

      // Check TODO. If we have more than 1 component enabled this wont work!
      // switch( data.type ){
      //   case 'lcd':
      //     do_lcd( component, params );
      //     break;
      //   case 'servo':
      //     do_servo( component, params );
      //     break;
      //   default:
      //     break;
      // }

      // NEW:
      builder.do( data.type, data.action, data.params );

    });

  });

});