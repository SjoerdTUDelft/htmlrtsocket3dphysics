Physics.Capsule = function(radius,length ,mass,rigid) {
	//Inherit all the PhysicsObject properties
	Physics.Object.call( this,mass,rigid );
	this.type = "Capsule";
	
	//Define Unique properties for Capsule
	this.radius = radius === undefined ? 1 : radius;
	this.length = length === undefined ? 1 : length;




	if(this.rigidbody == true) {
		this.InverseInertiaTensor.set(
			(2/5)*this.mass*this.radius*this.radius,0,0,
			0,(2/5)*this.mass*this.radius*this.radius,0,
			0,0,(2/5)*this.mass*this.radius*this.radius
			)

		this.InverseInertiaTensor.inverseInertia()
	}

}

Physics.Capsule.prototype = Object.create( Physics.Object.prototype );
Physics.Capsule.prototype.constructor = Physics.Capsule
