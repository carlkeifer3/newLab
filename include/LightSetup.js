// JavaScript Document
// TODO
// --make the spot larger so the shadows cover everything in the room
// -- tweak the colors so it makes the ambiance spooky
function LightSetup(shadMapD){
	//console.log("--LightSetup() starting");
				
	scene.add(new THREE.HemisphereLight( 0x002244, 0x0033CF, 0.2));			
	var Keylight = new THREE.DirectionalLight( 0xDDD2B3, 7.0 );
	Keylight.position.set( 600, 900, 400).multiplyScalar(1.1);
	scene.add( Keylight );
					
	Keylight.castShadow = true;			
			
	Keylight.shadowMapWidth  = shadMapD;
	Keylight.shadowMapHeight = shadMapD;
			
	var d = 600;	
	
	Keylight.shadowCameraLeft   = -d;
	Keylight.shadowCameraRight  = d;
	Keylight.shadowCameraTop    = d * 1.5;
	Keylight.shadowCameraBottom = -d;
	
	Keylight.shadowCameraFar = 3500;
	Keylight.shadowCameraVisible = false;	
	
	var Rimlight = new THREE.DirectionalLight( 0x0055FF, 12.0 );
	Rimlight.position.set( -200, 600, -500).multiplyScalar(1.1);
	scene.add( Rimlight );		
	
	Rimlight.castShadow = true;
	
	Rimlight.shadowMapWidth  = shadMapD;
	Rimlight.shadowMapHeight = shadMapD;
	
	Rimlight.shadowCameraLeft   = -d;
	Rimlight.shadowCameraRight  = d;
	Rimlight.shadowCameraTop    = d * 1.5;
	Rimlight.shadowCameraBottom = -d;
	
	Rimlight.shadowCameraFar = 3500;
	Rimlight.shadowCameraVisible = false;
	
	
	console.log("--LightSetup() complete");
}