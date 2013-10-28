var genericComponent = require( '../lib/abstractComponent' );
function AbstractComponent( options ){

}

AbstractComponent.prototype.getComponentType = function(){
  return this.componentType;
};

