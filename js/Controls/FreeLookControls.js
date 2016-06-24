FreeLookControls= function ( camera ) {
	this.speed = 0.15;
	this.PI = Math.PI
	this._target = new THREE.Vector3();
	
	this.update = function (controls) {
		
		var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
		
		euler.x = controls._theta*1.5;
		euler.y = -controls._phi + this.PI/2 ;
		camera.quaternion.setFromEuler( euler );

		if(controls.run) this.speed = 0.5		
		else this.speed = 0.03
		
		if(controls.jump != controls.crouch) {
			if(controls.jump) camera.position.y += this.speed
			if(controls.crouch) camera.position.y -= this.speed
		}
		
		if(controls.forward != controls.backward) {
			var k = new THREE.Vector3();
			k.set(Math.sin(euler.y)*Math.cos(euler.x),   -Math.sin(euler.x), Math.cos(euler.y)*Math.cos(euler.x));
			k.multiplyScalar(this.speed)
			if(controls.forward) camera.position.sub(k)
			if(controls.backward) camera.position.add(k);
		}
			
		if (controls.right != controls.left) {
			var b = new THREE.Vector3();
			euler.y -= this.PI/2
			b.set(Math.sin(euler.y),  0, Math.cos(euler.y));
			b.multiplyScalar(this.speed)

			
			if (controls.right) camera.position.sub(b)
			if (controls.left) camera.position.add(b);
		}
	}
}
