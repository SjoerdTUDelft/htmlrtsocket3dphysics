Physics.Dimension = function(normal) {
	
	Physics.Object.call( this);

	this.static = true;
	this.infiniteM = true;
	this.useGravity = false;
	this.normal = normal == undefined ? new THREE.Vector3() : normal
	this.type = "Dimension";
	
}

Physics.Dimension.prototype = {
	setDimension : function(x,y,z) {
		var rotation = new THREE.Euler;
		if(this.parent != null) { 

			rotation.x = this.parent.rotation.x 
			rotation.y = this.parent.rotation.y 
			rotation.z = this.parent.rotation.z 
		} else {
			rotation.x = x;
			rotation.y = y
			rotation.z = z;
		}

		var k =new THREE.Euler().copy(rotation)
		var z = new THREE.Vector3().setZ(1);		
		var m3 = new THREE.Matrix4();
		m3.makeRotationFromEuler( k );
		z.transformDirection(m3)
		this.normal.copy(z)
		
	}
}
