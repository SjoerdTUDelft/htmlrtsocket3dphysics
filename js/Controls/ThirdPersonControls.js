ThirdPersonControls= function ( camera) {

	this._radius = 3;
	this._target = new THREE.Vector3();
	this.PI = Math.PI
	this.movementSpeed = 5;

	 this.update = function (controls) { 
		
		var theta = controls._theta*0.7 +1.1
		var phi = controls._phi

		camera.position.x = this._target.x +this._radius * Math.sin(theta) * Math.cos(phi);
		camera.position.z = this._target.z +this._radius * Math.sin(theta) * Math.sin(phi);
		camera.position.y = this._target.y +this._radius * Math.cos(theta) ;

		if(controls.forward) {
			var z = new THREE.Vector3();
			z.copy(camera.getWorldDirection())
			z.y = 0;
			z.normalize();
			z.multiplyScalar(this.movementSpeed)
			Player.object.Collision.velocity.x = z.x;
			Player.object.Collision.velocity.z = z.z;
		}
		if(controls.jump) {

			var z = new THREE.Vector3();
 
			Player.object.Collision.velocity.y = 10;
		}

		camera.lookAt(this._target);
	}

}
