Physics.Contact = function(normal,penetration,position,res,body1,body2) {
	if(!normal instanceof THREE.Vector3)debugger
	if(!penetration instanceof Number)debugger
	if(!position instanceof THREE.Vector3)debugger
	if(!res instanceof Number)debugger
	if(!body1 instanceof Physics.Object)debugger


	this.Vector1 = normal;
	this.Vector2 = new THREE.Vector3();
	this.Vector3 = new THREE.Vector3();
	this.contactToWorld = new THREE.Matrix3();
	this.penetration = penetration;
	this.point = position;
	this.Restitution = res;
	this.relcontact = [];
	this.contactVelocity;
	this.desiredDeltaVelocity;
	this.bodies = [];
	this.bodies[0] = body1;
	this.velocityLimit = 0.15;
	this.friction = 0.45;
	if(body2) {
		this.bodies[1] = body2;
	}
}


Physics.Contact.prototype.Orthonomal = function() {	
	if(Math.abs(this.Vector1.x) > Math.abs(this.Vector1.y)) {
		var s = 1.0/Math.sqrt(this.Vector1.z*this.Vector1.z + this.Vector1.x*this.Vector1.x);
		this.Vector2.x = this.Vector1.z*s;
		this.Vector2.y = 0;
		this.Vector2.z = -this.Vector1.x*s;

		this.Vector3.x = this.Vector1.y*this.Vector2.x;
		this.Vector3.y = this.Vector1.z*this.Vector2.x - this.Vector1.x*this.Vector2.z;
		this.Vector3.z = -this.Vector1.y*this.Vector2.x;
	} else {
		var s = 1.0/Math.sqrt(this.Vector1.z*this.Vector1.z + this.Vector1.y*this.Vector1.y);
		this.Vector2.x = 0;
		this.Vector2.y = -this.Vector1.z*s;
		this.Vector2.z = this.Vector1.y*s;

		this.Vector3.x = this.Vector1.y*this.Vector2.z - this.Vector1.z*this.Vector2.y;
		this.Vector3.y = -this.Vector1.x*this.Vector2.z;
		this.Vector3.z = this.Vector1.x*this.Vector2.y;
	}
	this.contactToWorld.set (
		this.Vector1.x,this.Vector2.x,this.Vector3.x,
		this.Vector1.y,this.Vector2.y,this.Vector3.y,
		this.Vector1.z,this.Vector2.z,this.Vector3.z
	)
}


Physics.Contact.prototype.SolvePenetration = function(velocityChange,rotationChange,penetration) {
	var linearInertia = [];
	var angularInertia = [];
	var totalInertia = 0;
	for(i = 0; i < this.bodies.length; i++) {
		var angularInertiaWorld = new THREE.Vector3();
		angularInertiaWorld.crossVectors(this.relcontact[i],this.Vector1);
		angularInertiaWorld.applyMatrix3(this.bodies[i].WorldInverseInertiaTensor);
		angularInertiaWorld.cross(this.relcontact[i]);

		angularInertia[i] = angularInertiaWorld.dot(this.Vector1);
		linearInertia[i] = this.bodies[i].invmass;

		totalInertia += linearInertia[i] + angularInertia[i];
	}
	var inverseInertia = 1/totalInertia;
	var linearMove = [];
	var angularMove = [];
	linearMove[0] = penetration * linearInertia[0] * inverseInertia
	angularMove[0] = penetration * angularInertia[0] * inverseInertia
	if(this.bodies[1]) {
		linearMove[1] = -penetration * linearInertia[1] * inverseInertia
		angularMove[1] = -penetration * angularInertia[1] * inverseInertia
	}

	for(i = 0 ; i < this.bodies.length;i ++) {
		var projection = new THREE.Vector3().copy(this.relcontact[i]);
		var z = new THREE.Vector3().copy(this.Vector1).multiplyScalar(-this.relcontact[i].dot(this.Vector1))

		projection.add(z);
		var limit = 0.2 *projection.length();

		
		if(angularMove[i] < -limit) {
			var totalMove = linearMove[i] + angularMove[i];
			angularMove[i] = -limit
			linearMove[i] = totalMove - angularMove[i];
		} else if(angularMove[i] > limit) {
			var totalMove = linearMove[i] + angularMove[i];
			angularMove[i] = limit;
			linearMove[i] = totalMove - angularMove[i];
		}
		

		if(angularMove[i] == 0) {
			rotationChange[i].setZero();
		} else {
			rotationChange[i] = new THREE.Vector3().crossVectors(this.relcontact[i],this.Vector1);
			rotationChange[i].applyMatrix3(this.bodies[i].WorldInverseInertiaTensor);
			rotationChange[i].multiplyScalar(angularMove[i]/angularInertia[i]);
			this.bodies[i].updateRotation(rotationChange[i]);
		}

		velocityChange[i] = new THREE.Vector3().copy(this.Vector1).multiplyScalar(linearMove[i]);
		this.bodies[i].parent.position.add(velocityChange[i]);
		if(!this.bodies[i].isAwake)this.bodies[i].updateData();
	}

}

Physics.Contact.prototype.calculateLocalVelocity = function(index) {
	var velocity = new THREE.Vector3();
		velocity.copy(this.bodies[index].rotVelocity);
		velocity.cross(this.relcontact[index]);
		velocity.add(this.bodies[index].velocity);
		velocity.applyTransposeMatrix3(this.contactToWorld)

	var velocityFromAcc = new THREE.Vector3().copy(this.bodies[index].lastForce);
		velocityFromAcc.applyTransposeMatrix3(this.contactToWorld);
		velocityFromAcc.x = 0;

		velocity.add(velocityFromAcc);
		return velocity;
}

Physics.Contact.prototype.calculateDesiredDeltaVelocity = function() {
		var velocityFromAcc = 0;
	if(this.bodies[0].isAwake == true) {
			velocityFromAcc = this.bodies[0].lastForce.dot(this.Vector1);
	}
	if(this.bodies[1] && this.bodies[1].isAwake == true) {
		 velocityFromAcc -= this.bodies[1].lastForce.dot(this.Vector1);
	}
	var res = this.Restitution;
	if(Math.abs(this.contactVelocity.x) < this.velocityLimit){
		res = 0;
	}	
	this.desiredDeltaVelocity = -this.contactVelocity.x -res * (this.contactVelocity.x - velocityFromAcc)

}

Physics.Contact.prototype.Prepare = function() {

	this.Orthonomal();
	this.relcontact[0] = new THREE.Vector3().subVectors(this.point,this.bodies[0].parent.position)

	if(this.bodies[1]) {
		this.relcontact[1] = new THREE.Vector3().subVectors(this.point,this.bodies[1].parent.position)
	}

	this.contactVelocity = this.calculateLocalVelocity(0);
	if(this.bodies[1]) {
		this.contactVelocity.sub(this.calculateLocalVelocity(1));
	}

	this.calculateDesiredDeltaVelocity();

}

Physics.Contact.prototype.matchAwakeState = function() {
	if(this.bodies[1] == undefined) return;
	if(this.bodies[0].isAwake == false) {
		this.bodies[0].setAwake(true);
	} else if (this.bodies[1].isAwake == false) {
		this.bodies[1].setAwake(true);
	}
}