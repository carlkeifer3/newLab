// JavaScript Document
function animatedGeoLoader(){
	//Animated Models
	//AnimSimple		
	var AnimSimple = new THREE.JSONLoader();
	AnimSimple.load( '../Data/wizard/Wizard.js',function (geometry, materials){
				

		/*for ( var i = 0; i < geometry.animation.hierarchy.length; i ++ ) {
			var bone = geometry.animation.hierarchy[ i ];

			var first = bone.keys[ 0 ];
			var last = bone.keys[ bone.keys.length - 1 ];

			last.pos = first.pos;
			last.rot = first.rot;
			last.scl = first.scl;
		}*/
				
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;


		for ( var i = 0; i < materials.length; i ++ ) {

			var m = materials[ i ];
			m.skinning = true;
			m.morphTargets = true;

			//m.specular.setHSL( 0, 0, 0.1 );

			m.color.setHSL( 0, 255, 0.6 );

			//m.map = map;
			m.envMap = reflectionCube;
			//m.bumpMap = bumpMap;
			//m.bumpScale = 2;
			//m.combine = THREE.MixOperation;
			m.reflectivity = 0.45;
		};

					
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial({
			color : 0x00ff55,
			skinning : true,
			emissive: 0x000000,
			envMap : reflectionCube,
			reflectivity: 0.45		
		}));
		mesh.position.set( -80, 0, 0);
		mesh.rotateY(70);
		mesh.scale.set( 20, 20, 20 );
		scene.add(mesh);
		//animation(mesh);
			
		mesh.castShadow = true;
		mesh.receiveShadow = true;	
				
		helper = new THREE.SkeletonHelper( mesh );
		helper.material.linewidth = 3;
		helper.visible = false;
		scene.add( helper );

		animSimple = new THREE.Animation( mesh, geometry.animation );
		animSimple.play();	
		
		objects.push( mesh );

	});
}
