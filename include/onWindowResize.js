// JavaScript Document		
function onWindowResize(){
	// all of this needs to be updated to screen width and height or it will break wordpress				
			
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
			
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
		
	renderer.setSize(window.innerWidth, window.innerHeight );
}