// JavaScript Document
function animatedGeoLoader(){
	//Animated Models
	//AnimSimple		
	var AnimSimple = new THREE.JSONLoader();
	AnimSimple.load( '../Data/wizard/wizard.js',function (geometry, materials){
				
				
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;


		for ( var i = 0; i < materials.length; i ++ ) {

			var m = materials[ i ];
			m.skinning = true;
			m.morphTargets = true;

			//m.specular.setHSL( 0, 0, 0.1 );

			m.color.setHSL( 0, 255, 0.6 );

		};

					
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial({
			skinning : true,
			map: 		  new THREE.ImageUtils.loadTexture( "../Data/wizard/Wizard-Col.png" ),
			specularMap:  new THREE.ImageUtils.loadTexture( "../Data/wizard/Wizard-Spec.png"),
			normalMap:    new THREE.ImageUtils.loadTexture( "../Data/wizard/Wizard-Nrml.png" ),
			reflectivity: new THREE.ImageUtils.loadTexture( "../Data/wizard/Wizard-Gloss.png"),
			aoMap: 		  new THREE.ImageUtils.loadTexture( "../Data/wizard/Wizard-AO.png"),		
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
