Actor = function(geometry,material,physObj) {
	if( 'undefined' != typeof global ) {
	THREE.Object3D.call( this );
	} else {
	THREE.Mesh.call( this,geometry,material );
	}
	this.Collision = physObj;
	this.Collision.parent = this;
	this.type = 'Actor'
}

if( 'undefined' != typeof global ) {
	Actor.prototype = Object.create( THREE.Object3D.prototype );
    module.exports = Actor;
} else {
	Actor.prototype = Object.create( THREE.Mesh.prototype );
	Actor.prototype.constructor  = Actor;
}