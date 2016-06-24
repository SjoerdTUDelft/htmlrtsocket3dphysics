Physics.Sphere = function(radius,mass,rigid) {
	Physics.Object.call( this,mass,rigid );
	this.radius = radius;
	this.type = "Sphere";

	if(this.rigidbody == true) {
		this.InverseInertiaTensor.set(
			(2/5)*this.mass*this.radius*this.radius,0,0,
			0,(2/5)*this.mass*this.radius*this.radius,0,
			0,0,(2/5)*this.mass*this.radius*this.radius
			)

		this.InverseInertiaTensor.inverseInertia()
	}

}

Physics.Sphere.prototype = Object.create( Physics.Object.prototype );
Physics.Sphere.prototype.constructor = Physics.Sphere
