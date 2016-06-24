Physics.Box = function(mass,rigid,width,height,depth) {
	Physics.Object.call( this,mass,rigid );
	this.width = width == undefined ? 1 : width;
	this.height = height == undefined ? 1 : height;
	this.depth = depth == undefined ? 1 : depth;
	this.type = "Box";
	this.faces = [undefined,undefined,undefined];
	this.needsClear = true;

	if(this.rigidbody == true) {
		this.InverseInertiaTensor.set(
			(1/12)*(this.height*this.height+this.depth*this.depth),0,0,
			0,(1/12)*(this.width*this.width+this.depth*this.depth),0,
			0,0,(1/12)*(this.height*this.height+this.width*this.width)
			)

		this.InverseInertiaTensor.inverseInertia()
	}

}

Physics.Box.prototype = Object.create( Physics.Object.prototype );
Physics.Box.prototype.constructor = Physics.Box

Physics.Box.prototype.getFaceDir = function (i) {
	if(this.faces[i] === undefined) {
		var quaternion = this.parent.getWorldQuaternion( quaternion );
		this.faces[i] = new THREE.Vector3();
		if(i == 0) {
			this.faces[i].set( -1, 0, 0 ).applyQuaternion( quaternion );
		} else if(i == 1) {
			this.faces[i].set( 0, -1, 0 ).applyQuaternion( quaternion );
		} else {
			this.faces[i].set( 0, 0, -1 ).applyQuaternion( quaternion );
		}
	}
	return this.faces[i];
}