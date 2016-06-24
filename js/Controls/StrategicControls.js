StrategicControls = function ( camera) {
	this.oldheight = camera.position.y;
	this._height = 5;
	this.speed = 0.1;
	this.PI = Math.PI
	this.lerp = 1.0;

	this.update = function (controls) { 
		

		var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
		euler.x = -0.3*this.PI
		euler.y = this.PI/4 ;
		camera.quaternion.setFromEuler( euler );

		if(this.lerp > 0) {
			var diff = this._height - this.oldheight;
			camera.position.y = this._height - diff *THREE.Math.smootherstep(this.lerp, 0, 1)
			this.lerp -= 0.005;
		}
/*
		if(controls.forward != controls.backward) {
			var b = new THREE.Vector3();
			b.set(Math.sin(euler.y),  0, Math.cos(euler.y));
			b.multiplyScalar(this.speed)

			if(controls.forward) camera.position.sub(b)
			if(controls.backward) camera.position.add(b);
		}

		if (controls.right != controls.left) {	
			var b = new THREE.Vector3();
			euler.y -= this.PI/2
			b.set(Math.sin(euler.y),  0, Math.cos(euler.y));
			b.multiplyScalar(this.speed)

			
			if (controls.right) camera.position.sub(b)
			if (controls.left) camera.position.add(b);

		}
*/
		
	}

}
