'use strict';

var types = {};

//module.exports = exports = AbstractComponentFactory;

var getAllComponentTypes = function(){
  return types;
};

var getComponent = function( componentType ){
  // getting component instance
  var component = types[ componentType ];
  return ( component ? component : null);
};

var registerComponent = function( componentType, Component ){
  var proto = Component.prototype;

  if ( proto.defaultAction && proto.  )
};


module.exports.getComponent = getComponent;
module.exports.registerComponent = registerComponent;


var AbstractVehicleFactory = (function () {

    // Storage for our vehicle types
    var types = {};

    return {
        getVehicle: function ( type, customizations ) {
            var Vehicle = types[type];

            return (Vehicle ? new Vehicle(customizations) : null);
        },

        registerVehicle: function ( type, Vehicle ) {
            var proto = Vehicle.prototype;

            // only register classes that fulfill the vehicle contract
            if ( proto.drive && proto.breakDown ) {
                types[type] = Vehicle;
            }

            return AbstractVehicleFactory;
        }
    };
})();