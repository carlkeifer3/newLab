// JavaScript Document
function onMouseMove( event ){
	//console.log('onMouseMove() event');
	
	event.preventDefault();
	
	mouse.x = ( event.clientX / window.innerWidth) * 2 -1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	// 
	
	raycaster.setFromCamera( mouse, camera );
	
	if ( SELECTED ){
		var intersects = raycaster.intersectObject( plane );
		
		if ( interseccts.length > 0) {
		
			SELECTED.position.copy( intersects[ 0 ].point.sub( offset ));
			
		}
		
		return;
		
	}
	
	var intersects = raycaster.intersectObjects( objects );
	
	if ( intersects.length > 0 ) {
	
		if ( INTERSECTED != intersects[0].object ){
			
			if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.current.Hex );
			
			bookover = true;			
			
			INTERSECTED = intersects[0].object;
			//INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			//console.log('current Hex: ' + INTERSECTED.currentHex);
			//INTERSECTED.material.emmissive.setHex( 0x882200 );		
		
			plane.position.copy( INTERSECTED.position );
			plane.lookAt( camera.position );
		}
		container.style.cursor = 'pointer';
	}else{
	
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		
		bookover = false;
	
		INTERSECTED = null;
		
		container.style.cursor = 'auto'	
		
	}
}