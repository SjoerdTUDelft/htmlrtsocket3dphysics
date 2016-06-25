Actor = function(geometry,material,physObj) {
	THREE.Mesh.call( this,geometry,material );
	this.Collision = physObj;
	this.Collision.parent = this;
	this.type = 'Actor'
}
Actor.prototype = Object.create( THREE.Mesh.prototype );
Actor.prototype.constructor  = Actor;

if( 'undefined' != typeof global ) {
    module.exports = Actor;
}