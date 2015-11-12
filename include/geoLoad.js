// JavaScript Document

function geoLoad(fileLoc, material, pos, rot, shadow){
	//console.log("--geoLoad() starting");

	// read and parse the JSON data for this model
	var jsGeo = new THREE.JSONLoader();		
	jsGeo.load( fileLoc,function (geometry, materials){
				
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;				
						
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial({
				
				map: 		  new THREE.ImageUtils.loadTexture( "../Data/" + material + "-Col.png" ),
				specularMap:  new THREE.ImageUtils.loadTexture( "../Data/" + material + "-Spec.png"),
				normalMap:    new THREE.ImageUtils.loadTexture( "../Data/" + material + "-Nrml.png" ),
				normalScale: new THREE.Vector2( 2.8, 2.8 ),
				reflectivity: new THREE.ImageUtils.loadTexture( "../Data/" + material + "-Gloss.png"),
				aoMap: 		  new THREE.ImageUtils.loadTexture( "../Data/" + material + "-Ao.png")//,
				//envMap: 	  reflectionCube
		}));

		// mesh positioning
		mesh.position.set( pos[0], pos[1], pos[2]);
		mesh.rotateX(rot[0]);
		mesh.rotateY(rot[1]);
		mesh.rotateZ(rot[2]);
		mesh.scale.set( 20, 20, 20 );
		scene.add(mesh);
			
		// shadow attribs			
		mesh.castShadow = shadow;
		mesh.receiveShadow = shadow;				
	});
	
	console.log("--geoLoad() finished");
}