// onDocumentMouseUp
function onMouseUp( event ){
	console.log('onMouseUp() called');
	
	event.preventDefault();
	controls.enabled = true;
	
	if ( INTERSECTED ) {
		plane.position.copy( INTERSECTED.position );
		
		SELECTED = null;	
	}
	container.style.cursor = 'auto';
}