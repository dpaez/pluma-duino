/**
 * Module dependencies.
 */

var five = require('johnny-five'),
  path = require('path'),
  fs = require('fs'),
  componentsFactory = require('./abstractComponent');
  components = new WeakMap(),
  _components = {},
  _instantiated = {};

/**
 * Module exports.
 */

module.exports = exports = Monster;

/**
 * Module constructor.
 */

function Monster( options ){
  // general module options
  
  if ( (typeof options === 'undefined') ||
    (typeof options.component === 'undefined') ) {
    return null;
  }

  options.root = options.root || path.resolve( __dirname, '../' );

  options.componentsRoot = options.componentsRoot || path.join( options.root, '/components' );
    
  fs.readdir(options.componentsRoot, function (er, files) {
    files.forEach(function( file ) {
      if ( !file.match(/\.js$/) ){ return; }
      _components[ file ] = require( path.join(options.componentsRoot, file.replace(/\.js$/, '')) );
    });
  });

  _components.forEach( function( componentModule ){
    try{
      componentsFactory.registerComponent( componentModule );
      // construct componentType, componentActions hash to be passed to board and emited.
      componentsEnabled.push( componentModule.componentType );
    }catch( e ){
      console.warning( e );
    }
  });

  return this;
}

/**
 * [getComponent Returns a device component for manipulation, if exists]
 * @param  {String} componentType a valid component tag
 * @param  {Object} options A hash used to construct the new component. Arduino stuff.
 * @return {Object}         A (cached) arduino (J5) component
 */
Monster.prototype.getComponent = function( componentType, options ){
  var _Comp = componentsFactory.getComponent( componentType );

  // module instances cache
  if ( !_instantiated[ componentType ] ){
    _instantiated[ componentType ] = _Comp.createComponent( options );
  }

  return _instantiated[ componentType ];
};


Monster.prototype.do = function( componentType, action, params ){
  // TODO: throw/return errors
  if ( (typeof componentType !== 'string') ||
    (typeof action !== 'string') ){
    return;
  }

  var comp = _instantiated[ componentType ] || undefined;
  if ( comp ){
    comp.prototype[ action ]( params );
    // or something better like...
    // comp.do( action ) ?
  }

};


