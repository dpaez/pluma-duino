/**
 * Module dependencies.
 */

var five = require('johnny-five'),
  components = new WeakMap(),
  _components = {};

/**
 * Module exports.
 */

module.exports = exports = Monster;

/**
 * Module constructor.
 */

function Monster( options ){
  // general module options or board options?
  if ( (typeof options === 'undefined') ||
    (typeof options.component === 'undefined') ) {
    return null;
  }

  return this;
}

Monster.prototype.createComponent = function( componentType, options ){
  options = options || {};
  var comp;

  // TODO: create object wrappers. Those objects will contain user defined behaviour
  switch( componentType ){
    case 'motor':
      comp = new five.Motor( options );
      break;
    case 'servo':
      comp = new five.Servo( options );
      break;
    case 'lcd':
      comp = new five.LCD( options );
      break;
    default:
      comp = undefined;
      break;
  }
  if ( comp ){
    // adding a new instantiated component
    _components[ componentType ] = comp;
  }

};

/**
 * [_getComponent Returns a device component for manipulation, if exists]
 * @param  {String} componentType a valid component tag
 * @return {Object}               a previously generated component instance
 */
Monster.prototype._getComponent = function( componentType ){
  if ( typeof componentType !== 'string' ){ return; }

  return _components[ componentType ];
};

Monster.prototype.do = function( componentType, action ){
  // TODO: throw/return errors
  if ( (typeof componentType !== 'string') ||
    (typeof action !== 'string') ){
    return;
  }

  var comp = _components[ componentType ] || undefined;
  if ( comp ){
    comp.prototype[ action ]();
    // or something better like...
    // comp.do( action ) ?
  }


};


