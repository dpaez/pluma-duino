/**
 * Module dependencies.
 */

var five = require('johnny-five'),
  path = require('path'),
  fs = require('fs'),
  util = require('util'),
  log = require('npmlog'),
  EventEmitter = require('events').EventEmitter,
  componentsFactory = require('./abstractComponent'),
  _components = [],
  _instantiated = {},
  componentsEnabled = [];

/**
 * Module exports.
 */

module.exports = exports = Builder;

/**
 * Module constructor.
 */

function Builder( options ){
  // general module options

  options = options || {};

  options.root = ( options.root ) ? options.root : path.resolve( __dirname, '..' );
  util.log( options.root );
  options.componentsRoot = ( options.componentsRoot ) ? options.componentsRoot : path.join( options.root, '/components' );
  util.log( options.componentsRoot );
  var that = this;
  fs.readdir(options.componentsRoot, function (er, files) {
    files.forEach(function( file ) {
      if ( !file.match(/\.js$/) ){ return; }

      var componentModule = require(path.join(options.componentsRoot, file.replace(/\.js$/, '')));

      try{
        componentsFactory.registerComponent( componentModule );
        util.log( util.inspect(componentModule) );
        // construct componentType, componentActions hash to be passed to board and emited.
        var comp = {
          componentType: componentModule.componentType,
          componentActions: componentModule.componentActions
        };
        componentsEnabled.push( comp );
      }catch( e ){
        log.error( 'ERROR', 'An error ocurred on factory components registration. More info: ', e );
      }
    });

    that.emit( 'builder:setup_ready' );
  });

  this.on('builder:setup_ready', function(){
    log.info( 'INFO', 'Enabled components: ', componentsEnabled );
    this.emit( 'builder:ready', componentsEnabled );
  });

  return this;
}

/**
 * Inherits from event EventEmitter
 */

util.inherits( Builder, EventEmitter );

/**
 * [getComponent Returns a device component for manipulation, if exists]
 * @param  {String} componentType a valid component tag
 * @param  {Object} options A hash used to construct the new component. Arduino stuff.
 * @return {Object}         A (cached) arduino (J5) component
 */
Builder.prototype.getComponent = function( componentType, options ){
  var _Comp = componentsFactory.getComponent( componentType );

  // module instances cache
  if ( !_instantiated[ componentType ] ){
    _instantiated[ componentType ] = _Comp.createComponent( options );
  }

  return _instantiated[ componentType ];
};


Builder.prototype.do = function( componentType, action, params ){
  // TODO: throw/return errors
  if ( (typeof componentType !== 'string') ||
    (typeof action !== 'string') ){
    return;
  }

  params = params || {};

  var comp = _instantiated[ componentType ] || undefined;
  if ( comp ){
    comp.prototype[ action ]( params );
    // or something better like...
    // comp.do( action ) ?
  }

};


