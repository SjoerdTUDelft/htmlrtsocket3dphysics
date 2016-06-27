Physics = function() {
this.Objects = [];
this.Strings = [];
this.Statics = [];
this.Contacts = [];
sleepEpsilon = .2;
positionEpsilon = 0.001;
velocityEpsilon = 0.001;
}

Physics.prototype = {
	constructor : Physics,

	add : function(PhysicsObject) {
		if(PhysicsObject.Collision.static == true) {
			this.Statics.push(PhysicsObject)
		} else {
			this.Objects.push(PhysicsObject);
		}
	},

	addString : function(PhysicsString) {
		this.Strings.push(PhysicsString)
	},
	update : function(dt) {	
		this.UpdateSprings();
		this.ApplyForces(dt);

		this.CheckCollisions();
		this.PrepareContacts();
		this.ClearAcceleration();
		this.ClearTorque();
		this.ClearFaces();
		this.ClearContacts();
	},
	ClearContacts : function() {
		this.Contacts.splice(0,this.Contacts.length)
	},
	ClearFaces : function() {
		for(var i = 0 ; i < this.Objects.length;i++) {
			if(this.Objects[i].Collision.needsClear == true) {
				this.Objects[i].Collision.faces = [undefined,undefined,undefined];
			}
		}
	},
	ClearAcceleration : function() {
		for(var i = 0 ; i <this.Objects.length;i++) {
			this.Objects[i].Collision.force = new THREE.Vector3()
		}
	},
	ClearTorque : function() {
		for(var i = 0 ; i <this.Objects.length;i++) {
			this.Objects[i].Collision.angForce = new THREE.Vector3()
		}
	},
	UpdateSprings : function() {
		for(var i = 0; i < this.Strings.length; i++ ){
			
			var len = new THREE.Vector3() 
			len.sub(this.Strings[i].position)
			len.add(this.Strings[i].end.position)
			var k = len.length()
			

			k = this.Strings[i].baseLength - k  
			this.Strings[i].curLength = k;
			k  *= this.Strings[i].constant

			len.normalize()
					this.Strings[i].relative = len;	
			
			len.multiplyScalar(k);
			this.Strings[i].end.Collision.force.add(len);
			/*
			var len = new THREE.Vector3() 
			len.copy(this.Strings[i].end.position)
			len.sub(this.Strings[i].position)
			
			var gamma = 0.5 * Math.sqrt(4*this.Strings[i].constant-this.Strings[i].damping*this.Strings[i].damping)
			if(gamma == 0) return;
			var c = new THREE.Vector3()
			c.copy(len);
			c.multiplyScalar(this.Strings[i].damping/(2*gamma))
			var k = new THREE.Vector3()
			k.copy(this.Strings[i].end.Collision.velocity)
			k.multiplyScalar(1/gamma)
			c.add(k)
			
			var z = new THREE.Vector3()
			z.copy(len)
			z.multiplyScalar(Math.cos(gamma*dt))
			c.multiplyScalar(Math.sin(gamma*dt))
			z.add(c)
			z.multiplyScalar(Math.exp(-0.5*dt*this.Strings[i].damping))
			var acc = new THREE.Vector3()
			acc.copy(z)
			acc.sub(len)
			acc.multiplyScalar(1/(dt*dt))
			var k = new THREE.Vector3()
			k.copy(this.Strings[i].end.Collision.velocity)
			k.multiplyScalar(dt)
			acc.sub(k)
			this.Strings[i].end.Collision.force.add(acc.multiplyScalar(this.Strings[i].end.Collision.mass))
			*/
		}
	},
	CheckCollisions : function() {
		for(var i = 0; i < this.Objects.length; i++ ){
			for(var k = 0; k < this.Statics.length; k++) {
				if(this.Statics[k].Collision.type == "Dimension") {	
					if(this.Objects[i].Collision.type == "Sphere") {	
						this.SphereDimension(this.Objects[i],this.Statics[k]);
					} else if (this.Objects[i].Collision.type == "Box") {
						this.BoxDimension(this.Objects[i],this.Statics[k]);
					}
				}
			}
			for(var k = i+1; k < this.Objects.length; k++) {
				if(this.Objects[i].Collision.type == "Sphere") {
					if(this.Objects[k].Collision.type == "Sphere") {
						this.SphereSphere(this.Objects[i],this.Objects[k]);
					}else if(this.Objects[k].Collision.type == "Box"){
					//	this.BoxSphere(this.Objects[k],this.Objects[i]);
					}
				} else if (this.Objects[i].Collision.type == "Box") {
					if(this.Objects[k].Collision.type == "Sphere") {
					//	this.BoxSphere(this.Objects[i],this.Objects[k]);
					} else if (this.Objects[k].Collision.type == "Box") {
					//	this.BoxBox(this.Objects[k],this.Objects[i]);

					}
				}
			}
		}
	},
	ApplyForces : function(dt) {
		for(var i = 0; i < this.Objects.length; i ++ ) {
			if(this.Objects[i].Collision.isAwake == false) continue;
			
			this.ApplyDrag(this.Objects[i].Collision)
			this.Objects[i].Collision.force.multiplyScalar(this.Objects[i].Collision.invmass)

			if(this.Objects[i].Collision.useGravity == true) {
				this.Objects[i].Collision.force.y -=  9.8
			}
			this.Objects[i].Collision.force.multiplyScalar(dt);	
			this.Objects[i].Collision.velocity.add(this.Objects[i].Collision.force)

			var v = new THREE.Vector3(); v.copy(this.Objects[i].Collision.velocity); v.multiplyScalar(dt)
			this.Objects[i].position.add(v);

			if(this.Objects[i].Collision.rigidbody == true) {
				var len = this.Objects[i].Collision.rotVelocity.length() 
				var l = this.Objects[i].Collision.rotVelocity.clone()
				l.normalize()
				l.multiplyScalar(len*len*this.Objects[i].Collision.angdampfac*dt) 
				this.Objects[i].Collision.rotVelocity.sub(l)

				this.Objects[i].Collision.updateRotation(this.Objects[i].Collision.rotVelocity,dt)

				len = this.Objects[i].Collision.rotVelocity.length() 
				l = this.Objects[i].Collision.rotVelocity.clone()
				l.normalize()
				l.multiplyScalar(len*len*this.Objects[i].Collision.angdampfac*dt) 
				this.Objects[i].Collision.rotVelocity.sub(l)
				this.Objects[i].Collision.updateData();

			}
			this.Objects[i].Collision.lastForce.copy(this.Objects[i].Collision.force);

			if(this.Objects[i].Collision.canSleep == true) {
				var cMotion = this.Objects[i].Collision.velocity.dot(this.Objects[i].Collision.velocity) + 
							 this.Objects[i].Collision.rotVelocity.dot(this.Objects[i].Collision.rotVelocity);
				var bias = Math.pow(0.5,dt);
				this.Objects[i].Collision.motion = bias*this.Objects[i].Collision.motion + (1-bias)*cMotion;
				if(this.Objects[i].Collision.motion < sleepEpsilon) {
					this.Objects[i].Collision.setAwake(false)
				}else if (this.Objects[i].Collision.motion > 10 * sleepEpsilon) {
					motion = 10 * sleepEpsilon
				}
			}
		}	
	},
	ApplyDrag : function(Collision) {
		var len = Collision.velocity.length() 
		var l = Collision.velocity.clone()
		l.normalize()
		l.multiplyScalar(len*len*Collision.dampfac) 
		Collision.force.sub(l)
	},
	
	SphereSphere : function(SphereA,SphereB) {
	var normal = new THREE.Vector3().subVectors(SphereB.position , SphereA.position)
	var LengthPos = normal.dot(normal)
	var Radii = SphereA.Collision.radius+SphereB.Collision.radius;		

		//Check Collision
		if(LengthPos <=  Radii*Radii) {

			//Calculate Normal
			LengthPos = Math.sqrt(LengthPos)
			normal.divideScalar(LengthPos);
			var penetration = Radii - LengthPos;
			//Calculate TotalMass
			//var totalMass = SphereA.Collision.invmass + SphereB.Collision.invmass;	
			var dist = new THREE.Vector3().copy(normal).multiplyScalar(SphereB.Collision.radius-penetration/2);

			var position = new THREE.Vector3().copy(SphereA.position).add(dist)
			//Calculate penetration
			var Bouncefac = Math.min(SphereA.Collision.bounce , SphereB.Collision.bounce);
			var col = new Physics.Contact(normal,penetration,position,Bouncefac,SphereB.Collision,SphereA.Collision)
			this.Contacts.push(col);
			//this.ResolvePenetration(SphereA,SphereB,normal,penetration,totalMass)
			//this.ResolveContact(SphereA,SphereB,normal,totalMass)
		}
	},

	SphereDimension : function(Sphere,Dimension) {
		var Relative = new THREE.Vector3().subVectors(Sphere.position , Dimension.position)
		var Distance = Relative.dot(Dimension.Collision.normal)

		if(Distance <= Sphere.Collision.radius) {
			var penetration = Sphere.Collision.radius - Distance;
			//this.ResolvePenetration(Dimension,Sphere,Dimension.Collision.normal, penetration)
			//this.SolveContact(Dimension,Sphere,Dimension.Collision.normal)
			
			var norm2 = new THREE.Vector3().copy(Dimension.Collision.normal).multiplyScalar(Distance);
			var position = new THREE.Vector3().copy(Sphere.position).sub(norm2)
			var Bouncefac = Math.min(Sphere.Collision.bounce , Dimension.Collision.bounce);
			var col = new Physics.Contact(Dimension.Collision.normal,penetration,position,Bouncefac,Sphere.Collision)

			this.Contacts.push(col);
		} 
	},
	BoxDimension : function(Box,Dimension) {
		var Points = [];
		Points[0] = new THREE.Vector3().set(Box.Collision.width,Box.Collision.height,Box.Collision.depth)
		Points[1] = new THREE.Vector3().set(Box.Collision.width,Box.Collision.height,-Box.Collision.depth)
		Points[2] = new THREE.Vector3().set(Box.Collision.width,-Box.Collision.height,Box.Collision.depth)
		Points[3] = new THREE.Vector3().set(Box.Collision.width,-Box.Collision.height,-Box.Collision.depth)
		Points[4] = new THREE.Vector3().set(-Box.Collision.width,Box.Collision.height,Box.Collision.depth)
		Points[5] = new THREE.Vector3().set(-Box.Collision.width,Box.Collision.height,-Box.Collision.depth)
		Points[6] = new THREE.Vector3().set(-Box.Collision.width,-Box.Collision.height,Box.Collision.depth)
		Points[7] = new THREE.Vector3().set(-Box.Collision.width,-Box.Collision.height,-Box.Collision.depth)
		var Bouncefac = Math.min(Box.Collision.bounce , Dimension.Collision.bounce);
		for(var k in Points) {

			Points[k].applyMatrix4(Box.matrix)
			var Relative = new THREE.Vector3().subVectors(Points[k], Dimension.position)
			var Distance = Relative.dot(Dimension.Collision.normal)
			
			if(Distance <= 0) {
				var rel = new THREE.Vector3().copy(Dimension.Collision.normal).multiplyScalar(Distance)
				var position = new THREE.Vector3().copy(Points[k]).sub(rel)
				var col = new Physics.Contact(Dimension.Collision.normal,-Distance,position,Bouncefac,Box.Collision)
				this.Contacts.push(col);
			}
		}
	},

	BoxSphere : function(Box,Sphere) {

			var Center = new THREE.Vector3().copy(Sphere.position)
			Box.worldToLocal(Center);

			if (Math.abs(Center.x) - Sphere.Collision.radius > Box.Collision.width || 
				Math.abs(Center.y) - Sphere.Collision.radius > Box.Collision.height ||
				Math.abs(Center.z) - Sphere.Collision.radius > Box.Collision.depth) return;

			var Closest = new THREE.Vector3();
			var Distance = Center.x;
			if(Distance>Box.Collision.width) {Distance = Box.Collision.width}
			else if(Distance< -Box.Collision.width) {Distance = -Box.Collision.width}
			Closest.x = Distance;

			var Distance = Center.y;
			if(Distance>Box.Collision.height) {Distance = Box.Collision.height}
			else if(Distance< -Box.Collision.height) {Distance = -Box.Collision.height}
			Closest.y = Distance;

			var Distance = Center.z;
			if(Distance>Box.Collision.depth) {Distance = Box.Collision.depth}
			else if(Distance< -Box.Collision.depth) {Distance = -Box.Collision.depth}
			Closest.z = Distance
			var Relative = new THREE.Vector3();
			Distance = Relative.subVectors(Closest,Center).lengthSq()
		
			if(Distance > Sphere.Collision.radius * Sphere.Collision.radius) return;

			//console.log(Closest)
			Box.localToWorld(Closest);
			//console.log(Closest)
			var normal = new THREE.Vector3()
			normal.subVectors(Closest,Sphere.position).normalize()

			var penetration = Sphere.Collision.radius - Math.sqrt(Distance);
			var totalMass = Sphere.Collision.invmass + Box.Collision.invmass;

			this.ResolvePenetration(Box,Sphere,normal, penetration, totalMass)
			this.ResolveContact(Sphere,Box,normal, totalMass)

	},

	BoxBox : function(BoxA,BoxB) {

		if(true){//this.GetAxis(BoxA,BoxB)) {
			var Points = new Array(8);
			Points[0] = new THREE.Vector3().set(BoxA.Collision.width,BoxA.Collision.height,BoxA.Collision.depth)
			Points[1] = new THREE.Vector3().set(BoxA.Collision.width,BoxA.Collision.height,-BoxA.Collision.depth)
			Points[2] = new THREE.Vector3().set(BoxA.Collision.width,-BoxA.Collision.height,BoxA.Collision.depth)
			Points[3] = new THREE.Vector3().set(BoxA.Collision.width,-BoxA.Collision.height,-BoxA.Collision.depth)
			Points[4] = new THREE.Vector3().set(-BoxA.Collision.width,BoxA.Collision.height,BoxA.Collision.depth)
			Points[5] = new THREE.Vector3().set(-BoxA.Collision.width,BoxA.Collision.height,-BoxA.Collision.depth)
			Points[6] = new THREE.Vector3().set(-BoxA.Collision.width,-BoxA.Collision.height,BoxA.Collision.depth)
			Points[7] = new THREE.Vector3().set(-BoxA.Collision.width,-BoxA.Collision.height,-BoxA.Collision.depth)
			var normal = new THREE.Vector3();

			for(var k in Points) {
			var min_depth = 123123123;
			var depth = 0;
				Points[k].applyMatrix4(BoxA.matrix)
				BoxB.worldToLocal(Points[k])
					depth = BoxB.Collision.width - Math.abs(Points[k].x)
				if(depth < 0) continue;
				if(depth < min_depth) {
					min_depth = depth
					normalTemp = new THREE.Vector3();
					normalTemp.copy(BoxB.Collision.getFaceDir(0) )
					normalTemp.multiplyScalar(Points[k].x < 0 ? -1 : 1)
				}			

				depth = BoxB.Collision.depth - Math.abs(Points[k].z)
				if(depth < 0) continue;
				if(depth < min_depth) {
					min_depth = depth
					normalTemp = new THREE.Vector3();
					normalTemp.copy(BoxB.Collision.getFaceDir(2) )
					normalTemp.multiplyScalar(Points[k].z < 0 ? -1 : 1)
				}

				depth = BoxB.Collision.height - Math.abs(Points[k].y)
				if(depth < 0) continue;
				if(depth < min_depth) {
					min_depth = depth
					normalTemp = new THREE.Vector3();
					normalTemp.copy(BoxB.Collision.getFaceDir(1) )
					normalTemp.multiplyScalar(Points[k].y < 0 ? -1 : 1)
				}
				normal.copy(normalTemp)
							var totalMass = BoxA.Collision.invmass + BoxB.Collision.invmass;
			//console.log(min_depth)
			console.log(normal)
			//console.log(min_depth)
			normal.negate()
			this.ResolvePenetration(BoxB,BoxA,normal,min_depth,totalMass)	
			this.ResolveContact(BoxB,BoxA,normal,totalMass)

			}


		}
	},

	GetAxis : function (BoxA,BoxB) {
			var c = new THREE.Vector3()
			c.subVectors(BoxA.position,BoxB.position)
		
			if(this.CheckAxis(BoxA,BoxB,c)){
			 	console.log("NOHIT TERMINATE")
			 	return false
			} else if(this.CheckAxis(BoxB,BoxA,c)) {
				console.log("NOHIT TERMINATE")
				return false 
			} 
			return true;

	},

	CheckAxis : function(BoxA,BoxB,c) {
			for(var k = 0; k < 3; k++) {
				if(k == 0) {
					var LengthA = BoxA.Collision.width;
				}else if(k == 1) {
					var LengthA = BoxA.Collision.height;
				}else {
					var LengthA = BoxA.Collision.depth;
				}
				
				var LengthB = this.ProjectBox(BoxA.Collision.getFaceDir(k),BoxB);
				//console.log(LengthB)
				var LengthR = Math.abs(c.dot(BoxA.Collision.getFaceDir(k)))
				//console.log(LengthR)
				if(  LengthR < (LengthA + LengthB)) {
					
				} else {
					return true //NO CONTACT
				}

			}
	},

	ProjectBox : function(vector,Box) {
		return Math.abs(vector.dot(Box.Collision.getFaceDir(0))) * Box.Collision.width +
		Math.abs(vector.dot(Box.Collision.getFaceDir(1))) * Box.Collision.height +
		Math.abs(vector.dot(Box.Collision.getFaceDir(2))) * Box.Collision.depth
	},

	ResolveContact : function(ObjectA,ObjectB,normal,totalMass) {

			//Calculate Relative Velocity
			var RelativeVelocity = new THREE.Vector3().subVectors(ObjectB.Collision.velocity , ObjectA.Collision.velocity)
			var LengthVelocity = RelativeVelocity.length();
			
			//Object standing still
			if(LengthVelocity == 0 ) return;
			var dot = RelativeVelocity.dot(normal)
			
			//Object Moving away
			if (dot > 0 ) return;
			
			//Resitution
			var Bouncefac = Math.min(ObjectA.Collision.bounce , ObjectB.Collision.bounce);
			var j = -Bouncefac * dot
	/*
			var LastAccel = new THREE.Vector3().subVectors(  ObjectB.Collision.force,ObjectA.Collision.force)
			var NewJ = LastAccel.dot(normal)
			NewJ *= dt;
			

			if(NewJ < 0 ) {
				j += Bouncefac*NewJ

				if(j<0) j = 0;
			}

		*/	
			j -= dot
			
			// Apply impulse
			if(ObjectA.Collision.static == true) {
				var ForceB = new THREE.Vector3()
				ForceB.copy(normal)
				ForceB.multiplyScalar(j)
				ObjectB.Collision.velocity.add(ForceB) ;
				return;
			} else if (ObjectB.Collision.static == true) {
				var ForceA = new THREE.Vector3()
				ForceA.copy(normal)
				ForceA.multiplyScalar(j)
				ObjectA.Collision.velocity.sub(ForceA)
				return;
			}
			
			j /=  totalMass;
			var ForceA = new THREE.Vector3()
			var ForceB = new THREE.Vector3()
			ForceA.copy(normal)
			ForceA.multiplyScalar(j)
			ForceB.copy(ForceA)
		
			ForceA.multiplyScalar(ObjectA.Collision.invmass);
			ForceB.multiplyScalar(ObjectB.Collision.invmass);
			ObjectA.Collision.velocity.sub(ForceA)
			ObjectB.Collision.velocity.add(ForceB) ;
	},
 
	ResolvePenetration : function(ObjectA,ObjectB,normal,penetration,totalMass) {
		if(ObjectA.Collision.infiniteM == true) {
			var k = new THREE.Vector3().copy(normal)
			ObjectB.position.add(k.multiplyScalar(penetration))
			return;
		} else if(ObjectB.Collision.infiniteM == true) {
			var k = new THREE.Vector3().copy(normal)
			ObjectA.position.sub(k.multiplyScalar(penetration))
			return;
		}
			
		var DisplaceA = new THREE.Vector3()
		var DisplaceB = new THREE.Vector3()
		DisplaceA.copy(normal)
		DisplaceB.copy(normal)
		
		DisplaceA.multiplyScalar(penetration*ObjectB.Collision.invmass/totalMass)
		DisplaceB.multiplyScalar(penetration*ObjectA.Collision.invmass/totalMass)

		ObjectA.position.add(DisplaceA)
		ObjectB.position.sub(DisplaceB)
	},

	SolveContact : function(contact,velocityChange,rotationChange) {	
		var totalMass = contact.bodies[0].invmass;
		var ImpulseToTorque = new THREE.Matrix3();
		ImpulseToTorque.setSkewSymmetric(contact.relcontact[0]);
		var preDeltaVelWorld = new THREE.Matrix3().multiplyMatrices(ImpulseToTorque,contact.bodies[0].WorldInverseInertiaTensor)
		var deltaVelWorld = new THREE.Matrix3().multiplyMatrices(preDeltaVelWorld,ImpulseToTorque);
		deltaVelWorld.multiplyScalar(-1);

		if(contact.bodies[1]) {
			totalMass += contact.bodies[1].invmass;
			ImpulseToTorque.setSkewSymmetric(contact.relcontact[1]);
			var preDeltaVelWorld2 = new THREE.Matrix3().multiplyMatrices(ImpulseToTorque,contact.bodies[1].WorldInverseInertiaTensor)
			var deltaVelWorld2 = new THREE.Matrix3().multiplyMatrices(preDeltaVelWorld2,ImpulseToTorque);
			deltaVelWorld2.multiplyScalar(-1);
			deltaVelWorld.add(deltaVelWorld2);

		}
		var deltaVelocity = new THREE.Matrix3().copy(contact.contactToWorld).transpose();
		deltaVelocity.multiply(deltaVelWorld);
		deltaVelocity.multiply(contact.contactToWorld);

		deltaVelocity.elements[0] += totalMass;
		deltaVelocity.elements[4] += totalMass;		
		deltaVelocity.elements[8] += totalMass;

		var impulseMatrix = new THREE.Matrix3().inverse(deltaVelocity)

		var impulseContact = new THREE.Vector3(contact.desiredDeltaVelocity,-contact.contactVelocity.y,-contact.contactVelocity.z);
		//if(impulseContact.x <= 0)return;

		impulseContact.applyMatrix3(impulseMatrix);
		var planarImpulse = Math.sqrt(impulseContact.z*impulseContact.z + impulseContact.y*impulseContact.y)
		
		if(planarImpulse > impulseContact.x*contact.friction) {
			impulseContact.y /= planarImpulse;
			impulseContact.z /= planarImpulse;

			impulseContact.x = deltaVelocity.elements[0] + deltaVelocity.elements[3] * contact.friction * impulseContact.y + deltaVelocity.elements[6] * contact.friction * impulseContact.z
			impulseContact.x = contact.desiredDeltaVelocity/impulseContact.x

			impulseContact.y *= contact.friction * impulseContact.x;
			impulseContact.z *= contact.friction * impulseContact.x;
		}



		var impulseWorld = new THREE.Vector3();
		impulseWorld.copy(impulseContact);
		impulseWorld.applyMatrix3(contact.contactToWorld);

		//if(contact.bodies[0].parent.name == "Sphere D") console.log(contact.bodies[0].rotVelocity);

		velocityChange[0] = new THREE.Vector3().copy(impulseWorld).multiplyScalar(contact.bodies[0].invmass)
		var impulseTorque1 = new THREE.Vector3().crossVectors(contact.relcontact[0],impulseWorld);
		rotationChange[0] = impulseTorque1.applyMatrix3(contact.bodies[0].WorldInverseInertiaTensor);

		contact.bodies[0].velocity.add(velocityChange[0]);
		contact.bodies[0].rotVelocity.add(rotationChange[0]);
		if(contact.bodies[1]) {
			impulseWorld.negate();
			velocityChange[1] = new THREE.Vector3().copy(impulseWorld).multiplyScalar(contact.bodies[1].invmass)
			var impulseTorque2 = new THREE.Vector3().crossVectors(contact.relcontact[1],impulseWorld);
			rotationChange[1] = impulseTorque2.applyMatrix3(contact.bodies[1].WorldInverseInertiaTensor);

			contact.bodies[1].velocity.add(velocityChange[1]);
			contact.bodies[1].rotVelocity.add(rotationChange[1]);
		}
		
	},

	AdjustVelocities :function() {
		var velocityChange = [];
		var rotationChange = [];
		velocityChange[0] = new THREE.Vector3();
		rotationChange[0] = new THREE.Vector3();
		velocityChange[1] = new THREE.Vector3();
		rotationChange[1] = new THREE.Vector3();
		var currentIteration = 0;
		var biggestVelocity = positionEpsilon;
		var index;
		var deltaVelocity = new THREE.Vector3();
		var temp = new THREE.Vector3();

		while(currentIteration < 35*this.Contacts.length){
			biggestVelocity = velocityEpsilon;
			index = this.Contacts.length;
			for(var z = 0; z<this.Contacts.length; z++) {
				if(this.Contacts[z].desiredDeltaVelocity > biggestVelocity) {
					biggestVelocity = this.Contacts[z].penetration;
					index = z;
				}
			}
			if(index == this.Contacts.length) break;

			this.Contacts[index].matchAwakeState();
			
			this.SolveContact(this.Contacts[index],velocityChange,rotationChange);

			for(i=0; i<this.Contacts.length; i++){
				for(var z = 0; z < this.Contacts[i].bodies.length; z++ ) {
					for(var d = 0; d < this.Contacts[index].bodies.length; d++ ) {
						if (this.Contacts[i].bodies[z] == this.Contacts[index].bodies[d]){
	                    	deltaVelocity.copy(velocityChange[d])
	                    	temp.crossVectors(rotationChange[d],this.Contacts[i].relcontact[z])
	                    	deltaVelocity.add(temp);

	                        this.Contacts[i].contactVelocity.add(deltaVelocity.applyTransposeMatrix3(this.Contacts[i].contactToWorld).multiplyScalar((z==1?-1:1)));
	                    	this.Contacts[i].calculateDesiredDeltaVelocity();
	                    }
					}
				}
			}
			currentIteration++;
		}

	},

	AdjustPenetrations : function() {
		var velocityChange = [];
		var rotationChange = [];
		velocityChange[0] = new THREE.Vector3();
		rotationChange[0] = new THREE.Vector3();
		velocityChange[1] = new THREE.Vector3();
		rotationChange[1] = new THREE.Vector3();
		var currentIteration = 0;
		var biggestPenetration = positionEpsilon;
		var index;
		var deltaPosition = new THREE.Vector3();
		var temp = new THREE.Vector3();
		while(currentIteration < 35*this.Contacts.length){//this.positionIterations) {
			biggestPenetration = positionEpsilon;
			index = this.Contacts.length;
			for(var z = 0; z<this.Contacts.length; z++) {
				if(this.Contacts[z].penetration > biggestPenetration) {
					biggestPenetration = this.Contacts[z].penetration;
					index = z;
				}
			}
			if(index == this.Contacts.length) break;

			this.Contacts[index].matchAwakeState();
			
			this.Contacts[index].SolvePenetration(velocityChange,rotationChange,biggestPenetration);

			for(i=0; i<this.Contacts.length; i++){
				for(var z = 0; z < this.Contacts[i].bodies.length; z++ ) {
					for(var d = 0; d < this.Contacts[index].bodies.length; d++ ) {
						if (this.Contacts[i].bodies[z] == this.Contacts[index].bodies[d]){
	                    	deltaPosition.copy(velocityChange[d])
	                    	temp.crossVectors(rotationChange[d],this.Contacts[i].relcontact[z])
	                    	deltaPosition.add(temp);

	                        this.Contacts[i].penetration += deltaPosition.dot(this.Contacts[i].Vector1) * (z?1:-1);
	                    }
					}
				}
			}

			
			currentIteration++;
		}

	},

	PrepareContacts : function() {

		for(var z = 0; z<this.Contacts.length; z++) {
			this.Contacts[z].Prepare();
		}

		this.AdjustVelocities();
		this.AdjustPenetrations();
		

			
	}
}


if( 'undefined' != typeof global ) {
    module.exports = Physics;
	require('./Object')
	require('./Contact')
	require('./Box')
	require('./Capsule')
	require('./Dimension')
	require('./Sphere')	
	require('./String')	
}





