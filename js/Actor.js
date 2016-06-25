Actor = function(geometry,material,physObj) {
	if( 'undefined' != typeof global ) {
	this.position = new THREE.Vector3();
	this.quaternion = new THREE.Quaternion();
	} else {
	THREE.Mesh.call( this,geometry,material );
	}
	this.Collision = physObj;
	this.Collision.parent = this;
	this.type = 'Actor'
}

if( 'undefined' != typeof global ) {
    module.exports = Actor;
} else {
	Actor.prototype = Object.create( THREE.Mesh.prototype );
	Actor.prototype.constructor  = Actor;
}