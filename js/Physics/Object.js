Physics.Object = function(mass,rigid) {
	this.parent = undefined;
	this.invmass =  mass == undefined ?  1 : 1/mass;
	this.mass =  mass == undefined ?  1 : mass;
	this.infiniteM = false;
	this.static = false;
	this.velocity = new THREE.Vector3();
	this.rotVelocity = new THREE.Vector3();
	this.force = new THREE.Vector3();
	this.lastForce = new THREE.Vector3();
	this.useGravity = true;
	this.bounce =  .4
	this.dampfac = 0.15
	this.angdampfac = 0.2;
	this.isAwake = true;
	this.canSleep = true;
	this.motion = 910;
	
	this.rigidbody = rigid == undefined ? false : rigid;

	if(this.rigidbody) {
		this.angVelocity = new THREE.Vector3()
		this.angForce = new THREE.Vector3()
		this.InverseInertiaTensor = new THREE.Matrix3()
		this.WorldInverseInertiaTensor = new THREE.Matrix3();
	}
	
}

Physics.Object.prototype = {
	setAwake : function(bool) {
		if(bool == true) {
			this.isAwake = true;
			motion = sleepEpsilon*12.0;
		} else {
			this.isAwake = false;
			this.velocity.setZero()
			this.rotVelocity.setZero();
		}
	},
	setMass : function(mass) {
		this.invmass = mass == undefined ?  1 : 1/mass;
		this.mass =  mass == undefined ?  1 : mass;
	},

	addForcePoint : function(vector, location) {
	
	},
	
	updateRotation : function(vector) {
		if(!(vector instanceof THREE.Vector3))debugger;
		var z = new THREE.Quaternion(vector.x*dt,vector.y*dt,vector.z*dt,0)
		z.multiplyQuaternions(z,this.parent.quaternion);
		this.parent.quaternion._x += z._x*0.5;
		this.parent.quaternion._y += z._y*0.5;
		this.parent.quaternion._z += z._z*0.5;
		this.parent.quaternion._w += z._w*0.5;
	},

	updateData : function() {
		this.parent.quaternion.normalize();
		this.parent.updateMatrixWorld(true);
		this.updateWorldInertiaTensor();
	},


	updateWorldInertiaTensor : function () {

		//this.WorldInverseInertiaTensor = new THREE.Matrix3().copy(this.InverseInertiaTensor); 
		var transpose = new THREE.Matrix3().getRotationMat4(this.parent.matrixWorld);
		transpose.transpose();
		var temp = new THREE.Matrix3().multiplyMatrices(this.InverseInertiaTensor,transpose)
		transpose.transpose();
		this.WorldInverseInertiaTensor.multiplyMatrices(transpose,temp);
		
		/*
		var t4 = this.parent.matrixWorld.elements[0]*this.InverseInertiaTensor.elements[0]+
				 this.parent.matrixWorld.elements[1]*this.InverseInertiaTensor.elements[3]+
				 this.parent.matrixWorld.elements[2]*this.InverseInertiaTensor.elements[6];
		var t9 = this.parent.matrixWorld.elements[0]*this.InverseInertiaTensor.elements[1]+
				 this.parent.matrixWorld.elements[1]*this.InverseInertiaTensor.elements[4]+
				 this.parent.matrixWorld.elements[2]*this.InverseInertiaTensor.elements[7];
		var t14 = this.parent.matrixWorld.elements[0]*this.InverseInertiaTensor.elements[2]+
				  this.parent.matrixWorld.elements[1]*this.InverseInertiaTensor.elements[5]+
				  this.parent.matrixWorld.elements[2]*this.InverseInertiaTensor.elements[8];
		var t28 = this.parent.matrixWorld.elements[4]*this.InverseInertiaTensor.elements[0]+
				  this.parent.matrixWorld.elements[5]*this.InverseInertiaTensor.elements[3]+
				  this.parent.matrixWorld.elements[6]*this.InverseInertiaTensor.elements[6];
		var t33 = this.parent.matrixWorld.elements[4]*this.InverseInertiaTensor.elements[1]+
				  this.parent.matrixWorld.elements[5]*this.InverseInertiaTensor.elements[4]+
				  this.parent.matrixWorld.elements[6]*this.InverseInertiaTensor.elements[7];
		var t38 = this.parent.matrixWorld.elements[4]*this.InverseInertiaTensor.elements[2]+
				  this.parent.matrixWorld.elements[5]*this.InverseInertiaTensor.elements[5]+
				  this.parent.matrixWorld.elements[6]*this.InverseInertiaTensor.elements[8];
		var t52 = this.parent.matrixWorld.elements[8]*this.InverseInertiaTensor.elements[0]+
				  this.parent.matrixWorld.elements[9]*this.InverseInertiaTensor.elements[3]+
				  this.parent.matrixWorld.elements[10]*this.InverseInertiaTensor.elements[6];
		var t57 = this.parent.matrixWorld.elements[8]*this.InverseInertiaTensor.elements[1]+
				  this.parent.matrixWorld.elements[9]*this.InverseInertiaTensor.elements[4]+
				  this.parent.matrixWorld.elements[10]*this.InverseInertiaTensor.elements[7];
		var t62 = this.parent.matrixWorld.elements[8]*this.InverseInertiaTensor.elements[2]+
				  this.parent.matrixWorld.elements[9]*this.InverseInertiaTensor.elements[5]+
				  this.parent.matrixWorld.elements[10]*this.InverseInertiaTensor.elements[8];

				  
		this.WorldInverseInertiaTensor.elements[0] = t4*this.parent.matrixWorld.elements[0]+
													 t9*this.parent.matrixWorld.elements[1]+
													 t14*this.parent.matrixWorld.elements[2];
		this.WorldInverseInertiaTensor.elements[1] = t4*this.parent.matrixWorld.elements[4]+
													 t9*this.parent.matrixWorld.elements[5]+
													 t14*this.parent.matrixWorld.elements[6];
		this.WorldInverseInertiaTensor.elements[2] = t4*this.parent.matrixWorld.elements[8]+
													 t9*this.parent.matrixWorld.elements[9]+
													 t14*this.parent.matrixWorld.elements[10];
		this.WorldInverseInertiaTensor.elements[3] = t28*this.parent.matrixWorld.elements[0]+
													 t33*this.parent.matrixWorld.elements[1]+
													 t38*this.parent.matrixWorld.elements[2];
		this.WorldInverseInertiaTensor.elements[4] = t28*this.parent.matrixWorld.elements[4]+
													 t33*this.parent.matrixWorld.elements[5]+
													 t38*this.parent.matrixWorld.elements[6];
		this.WorldInverseInertiaTensor.elements[5] = t28*this.parent.matrixWorld.elements[8]+
													 t33*this.parent.matrixWorld.elements[9]+
													 t38*this.parent.matrixWorld.elements[10];
		this.WorldInverseInertiaTensor.elements[6] = t52*this.parent.matrixWorld.elements[0]+
													 t57*this.parent.matrixWorld.elements[1]+
													 t62*this.parent.matrixWorld.elements[2];
		this.WorldInverseInertiaTensor.elements[7] = t52*this.parent.matrixWorld.elements[4]+
													 t57*this.parent.matrixWorld.elements[5]+
													 t62*this.parent.matrixWorld.elements[6];
		this.WorldInverseInertiaTensor.elements[8] = t52*this.parent.matrixWorld.elements[8]+
													 t57*this.parent.matrixWorld.elements[9]+
													 t62*this.parent.matrixWorld.elements[10];
	*/
	}



}