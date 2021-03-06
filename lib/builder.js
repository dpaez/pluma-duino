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
  _filters = {},
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
  options.componentsRoot = ( options.componentsRoot ) ? options.componentsRoot : path.join( options.root, '/components' );
  util.log( options.componentsRoot );
  var that = this;
  fs.readdir(options.componentsRoot, function (er, files) {
    files.forEach(function( file ) {
      if ( !file.match(/\.js$/) ){ return; }

      var componentModule = require(path.join(options.componentsRoot, file.replace(/\.js$/, '')));

      try{
        componentsFactory.registerComponent( componentModule );
        var comp = {
          componentType: componentModule.componentType,
          componentActions: componentModule.componentActions,
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

    //this.emit( 'builder:ready', componentsEnabled );

    if ( (options.ready) && (typeof options.ready === 'function') ){
      // triggerin' callback
      options.ready.call( this, componentsEnabled );
    }

  });

  return this;
}

/**
 * Inherits from event EventEmitter
 */

util.inherits( Builder, EventEmitter );

/**
 * [getComponent Returns & create a device component for manipulation, if exists]
 * @param  {String} componentType A valid component tag
 * @param  {Object} options A hash used to construct the new component. Arduino stuff.
 * @param  {String} componentID An id used to identify a instantiated component from each other (usually pin/s).
 * @return {Object}         A (cached) arduino (J5) component
 */
Builder.prototype.getComponent = function( componentType, options, componentID ){
  // Get the component factory first
  var CompModule = componentsFactory.getComponent( componentType );

  // if factory exists...
  if ( typeof CompModule === 'undefined' ){
    throw 'Received component is not registered: ' + componentType + ' with ID: ' + componentID ;
  }

  // Create and cache'd a new module instance
  if ( typeof _instantiated[ componentID ] === 'undefined' ){
    _instantiated[ componentID ] = CompModule.createComponent( options );
  }

  return _instantiated[ componentID ];
};

/**
 * [do Calls 'action' on component 'componentID' with 'params'. Does nothing if component does not exist.]
 * @param  {String} componentID Is a key identifying a single created component.
 * @param  {String} action      A string identifiyng a method to be performed by the component.
 * @param  {Object} params      An object containing information useful for the 'action'.
 * @return {}
 */
Builder.prototype.do = function( componentID, componentType, action, params, filters ){
  // TODO: throw/return errors
  if ( (typeof componentID !== 'string') ||
    (typeof componentType !== 'string') ||
    (typeof action !== 'string') ){
    return;
  }

  var CompModule = componentsFactory.getComponent( componentType );

  params = params || {};

  var compInstance = _instantiated[ componentID ] || undefined;

  if ( compInstance ){
    CompModule[ action ]( compInstance, params, filters );
  }

};

Builder.prototype.setFilters = function( componentID, componentType, filters ){
  // TODO: throw/return errors
  // NOTE: this are more like static filters.
  if ( (typeof componentID !== 'string') ||
    (typeof componentType !== 'string') ||
    (typeof filters !== 'object') ){
    throw "Wrong Arguments: componentID, componentType and action should be strings.";
  }

  var compInstance = _instantiated[ componentID ] || undefined;

  if ( compInstance ){
    _filters[ componentID ] = filters;
  }
  else{
    throw "There is no instance to be configurated. First activate or create a component instance.";
  }

};

Builder.prototype.stop = function( componentID ){

  if ( !componentID ){
    throw "componentID is missing.";
  }

  if ( (typeof componentID !== 'string') ){
    throw "Bad call: componentID should be a string."
  }

  var CompModule = componentsFactory.getComponent( componentType );
  var compInstance = _instantiated[ componentID ] || undefined;
  var enabledFilter = _filters.get( compInstance );
  if ( compInstance ){
    CompModule[ 'stop' ]( compInstance, params, _filters.get(compInstance) );
  }

};


