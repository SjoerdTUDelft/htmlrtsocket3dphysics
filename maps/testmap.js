

TESTMAP = function(Scene) {

if( 'undefined' == typeof global ) {

//Lights
	Scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
	//---------------------------------------------
    var spotLight = new THREE.SpotLight( 0xffffbb, .9 );
	spotLight.position.set( 0.5, 0.7, 1 );
	spotLight.position.multiplyScalar( 40 );
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 2048;
	spotLight.shadowMapHeight = 2048;
	spotLight.shadowCameraNear = 20;
	spotLight.shadowCameraFar =  90;
	spotLight.shadowCameraFov = 40;
	spotLight.shadowBias = -0.001
	Scene.add( spotLight );

//Textures
	var Environment = THREE.ImageUtils.loadTexture( "environment/HighRes.jpg");
	Environment.minFilter = THREE.LinearFilter;
	//---------------------------------------------
    var GenjiDiffuse = THREE.ImageUtils.loadTexture( "obj/textures/Tex_2407_0.png" )

//Materials

	shaderMat = new THREE.ShaderMaterial({
		uniforms: {
			time: { type: "f", value: 1.0 },
			roughness: { type: "f", value: 0.8 },
			light: { type: "v3", value: new THREE.Vector3(1,0,0)},
			size: { type : "f", value: 10.0},
			diffuse : { type: "t", value: GenjiDiffuse},
			refr : {type: "f", value: 1.0},
			envMap : {type: "t", value: Environment}
		},

		vertexShader:   document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	})
    //---------------------------------------------
	shaderMat2 = new THREE.ShaderMaterial({
		uniforms: {
			time: { type: "f", value: 1.0 },
			roughness: { type: "f", value: 0.8 },
			light: { type: "v3", value: new THREE.Vector3(1,0,0)},
			size: { type : "f", value: 10.0},
			diffuse : { type: "t", value: GenjiDiffuse}
		},
		vertexShader:   document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader2' ).textContent
	})

	var material = new THREE.MeshPhongMaterial( { color: 0xffffff});// map : THREE.ImageUtils.loadTexture( "obj/textures/Tex_2407_0.png" ,{},load,{}) } );
	var materialWall = new THREE.MeshPhongMaterial( { color: 0xffffff} );
	var red = new THREE.MeshBasicMaterial( { color: 0xff0000  , wireframe:true, side: THREE.DoubleSide} );
	var blue = new THREE.MeshBasicMaterial( { color: 0x0000ff  , wireframe:true, side: THREE.DoubleSide} );
	var domeMat = new THREE.MeshBasicMaterial( { map: Environment,side: THREE.DoubleSide});


//Imports
	var loader = new THREE.OBJLoader();
	function load() {
	loader.load( 	'obj/Ninja.obj',  
        function ( object ) {
		    object.traverse(function (object) {
            if(object instanceof THREE.Mesh) {
                    object.castShadow = true
                    object.material = shaderMat;
                }
            })
			object.position.y = -2;
			object.position.x = 1;
			object.position.z = 0
			object.rotation.y = -Math.PI * 0.2
			Gayden = object;
			var object2 = object.clone();
			object2.position.x = -1;
			object2.rotation.y = Math.PI * 0.2
			object2.traverse(function (object2) {
				if(object2 instanceof THREE.Mesh) {
					object2.castShadow = true
					object2.material = shaderMat2;
				}
			})
			Scene.add( object );
			Scene.add(object2);
		},
		onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		}, 
		onError = function ( xhr ) {
			console.log("LOADERROR")
		} 
	);
	}
	load();

//Geometry
   	var boxgeo= new THREE.BoxGeometry(2,2,2);
	var planefgeo= new THREE.PlaneGeometry(30,30,1,1);
	var Sphere3 = new THREE.SphereGeometry(1,20,20);
	var Spheresmall = new THREE.SphereGeometry(.2,12,12);
	var domeGeo = new THREE.SphereGeometry( 5000, 60, 40 );


 //Meshes


	var Dome = new THREE.Mesh(domeGeo,domeMat);
	Dome.scale.x = -1;
	Dome.rotation.y = Math.PI;
    Scene.add(Dome);

} //CLIENTONLY

    var PhysicsObjects = [];
//Physics
    //Rigidbodies
	var testa = new Physics.Sphere(1,1,true);
	var testb = new Physics.Sphere(1,1,true);
	var testc = new Physics.Sphere(1,1,true);
	var testcube = new Physics.Box(1,true,1,1,1)


 
    //Half-spaces
	var phFloor = new Physics.Dimension()
	var phXFloor = new Physics.Dimension()
	var phZFloor = new Physics.Dimension()
	var phXpFloor = new Physics.Dimension()
	var phZpFloor = new Physics.Dimension()
	var phDpFloor = new Physics.Dimension()

//Actors
    if( 'undefined' == typeof global ) {
        var Pcube = new Actor(Sphere3,material,testa);
        var Ccube = new Actor(Sphere3,red,testb);
        var Dcube = new Actor(Sphere3,red,testc);
        var Cube = new Actor(boxgeo,material,testcube)
        var Floor = new Actor(planefgeo,materialWall,phFloor)
        var FloorXp = new Actor(planefgeo,materialWall,phXpFloor)
        var FloorZp = new Actor(planefgeo,materialWall,phZpFloor)
        var FloorX = new Actor(planefgeo,materialWall,phXFloor)
        var FloorZ = new Actor(planefgeo,materialWall,phZFloor)
        var FloorD = new Actor(planefgeo,materialWall,phDpFloor)
 
        Pcube.castShadow = true;
        Ccube.castShadow = true;
        Dcube.castShadow = true;
        Cube.castShadow = true;
        Pcube.receiveShadow = true;
        Ccube.receiveShadow = true;
        Dcube.receiveShadow = true;	
        Cube.receiveShadow = true;
        Floor.receiveShadow = true;
        FloorXp.receiveShadow = true;
        FloorZp.receiveShadow = true;
        FloorX.receiveShadow = true;
        FloorZ.receiveShadow = true;
        FloorD.receiveShadow = true;
        var halfSpace = [Floor,FloorXp,FloorZp,FloorX,FloorZ,FloorD];
        for(var v = 0; v < halfSpace.length; v++) {
            halfSpace[v].visible = false;
        }
    } else {
        var Pcube = new Actor(null,null,testa);
        var Ccube = new Actor(null,null,testb);
        var Dcube = new Actor(null,null,testc);
        var Cube = new Actor(null,null,testcube)
        var Floor = new Actor(null,null,phFloor)
        var FloorXp = new Actor(null,null,phXpFloor)
        var FloorZp = new Actor(null,null,phZpFloor)
        var FloorX = new Actor(null,null,phXFloor)
        var FloorZ = new Actor(null,null,phZFloor)
        var FloorD = new Actor(null,null,phDpFloor)
    }
    Cube.Collision.setMass(10.1);  
    PhysicsObjects = [Pcube,Ccube,Dcube,Cube,Floor,FloorXp,FloorZp,FloorX,FloorZ,FloorD]

    //Strings
    var Strings =[]
	var teste = new Physics.String(2, 14,Pcube)
	Strings.push(teste);

//Transformations
   	Floor.rotation.set( -Math.PI * 0.5,0,0)
	Floor.Collision.setDimension()
	FloorXp.rotation.set(0,0,0)
	FloorXp.Collision.setDimension()
	FloorZp.rotation.set(0, -Math.PI * 0.5,0)
	FloorZp.Collision.setDimension()
	FloorX.rotation.set(0,Math.PI * 0.5,0)
	FloorX.Collision.setDimension()
	FloorZ.rotation.set(0, Math.PI ,0)
	FloorZ.Collision.setDimension()
	FloorD.rotation.set( -Math.PI * 0.43, 0 ,0)
	FloorD.Collision.setDimension()
	Floor.position.y = -2;
	FloorXp.position.y = 13;
	FloorXp.position.z = -15;	
	FloorZp.position.x = 15;
	FloorZp.position.y = 13;
	FloorX.position.x = -15;
	FloorX.position.y = 13;
	FloorZ.position.y = 13;
	FloorZ.position.z = 15;
	FloorD.position.y = -1;
	FloorD.position.z = -5;
	Cube.position.x = -5;
	Cube.position.y = 4;
	Cube.position.z = 10;
	Dcube.position.z = 7;
	Ccube.position.z=  4;
	Pcube.position.z=  1;
	teste.position.y =12;

    if( 'undefined' == typeof global ) {
        return new newLevel(PhysicsObjects,Strings)
    } else {
        return PhysicsObjects;
    }
}

if( 'undefined' != typeof global ) {
    module.exports = TESTMAP;
}  else {
    newLevel = function(Physics,Strings) {
        this.physics = Physics;
        this.strings = Strings;
    }
}
