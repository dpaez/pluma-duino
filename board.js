'use strict';

var util = require('util'),
    five = require('johnny-five'),
    SIO = require('socket.io'),
    Builder = require('./lib/builder'),
    board = new five.Board(),
    io = SIO.listen(8080),
    _components = [],
    _state = '',
    builder;

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

  io.sockets.on('connection', function( socket ){

    // change this for a callback fn added to Builder creation or think for something else
    // builder.on('builder:ready', function( components ){
    //   _components = components;
    //   //socket.emit( 'plumaduino:components_attached', components );
    // });

    socket.on('plumaduino:board_status', function(){
      // stupid app/board syncro event
      socket.emit( 'plumaduino:board_ready' );
    });

    socket.on('plumaduino:components_status', function(){
      if ( _state === 'components_attached' ){
        socket.emit( 'plumaduino:components_attached', _components );
      }else{
        // retry with interval?
        socket.emit( 'plumaduino:components_not_attached' );
      }
    });

    socket.on('plumaduino:create_component', function( data ){

      if ( !data ) { return; }

      var component = builder.getComponent( data.type, data.options, data.componentID );

    });

    socket.on('plumaduino:component_do', function( data ){

      if (!data) { return; }

      data.params = data.params || {};

      builder.do( data.componentID, data.componentType, data.action, data.params );

    });

  });

});