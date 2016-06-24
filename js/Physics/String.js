Physics.String = function(length,force,object) {
	
	this.baseLength = length;
	this.constant = force;
	this.end = object
	this.position = new THREE.Vector3();
	this.damping = 0.14
}