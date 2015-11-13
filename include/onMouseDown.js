// onDocumentMouseDown
function onMouseDown( event ){
	//console.log("onMouseDown() called");	
	if( bookover == true){
		if ( animated == true){
			console.log("animation off");
			animated = false;
		}else{
			console.log("animation on");
			animated = true;	
		}
	}
	event.preventDefault()
}