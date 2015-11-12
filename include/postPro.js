// Post processing
function initPost(){
			
	post.scene = new THREE.Scene();
	
	post.camera = new THREE.OrthographicCamera( window.innerWidth / - 2,
												window.innerWidth / 2,
												window.innerHeight / 2,
												window.innerHeight / - 2, -10000, 10000 );
	post.camera.position.z = 100;
	post.scene.add( post.camera );
			
	var pars = { minFilter: THREE.LinearFilter,
				 magFilter: THREE.LinearFilter,
				 format: THREE.RGBFormat};
	post.rtTextureColors = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars);
		
	//Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
	// investigate further for now.
	// pars.format = THREE.LuminanceFormat;
			
	// I would have this quarter size and use it as one of the ping-pong render
	// targets but the aliasing causes some temporal flickering
			
	post.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars);
			
	// aggressive downsize god-ray ping-pong render targets to minimize cost
	var w = window.innerWidth / 4.0;
	var h = window.innerHeight / 4.0;
	post.rtTextureGR1 = new THREE.WebGLRenderTarget( w, h, pars);
	post.rtTextureGR2 = new THREE.WebGLRenderTarget( w, h, pars);
			
	var grGenShader = THREE.ShaderGodRays ["godrays_generate" ];
	post.grGenUniforms = THREE.UniformsUtils.clone( grGenShader.uniforms);
	post.matGrGenerate = new THREE.ShaderMaterial({
					
			uniforms: post.grGenUniforms,
			vertexShader: grGenShader.vertexShader,
			fragmentShader: grGenShader.fragmentShader
	});
			
	var grCombineShader = THREE.ShaderGodRays[ "godrays_combine" ];
	post.grCombineUniforms = THREE.UniformsUtils.clone( grCombineShader.uniforms );
	post.matGrCombine = new THREE.ShaderMaterial({

			uniforms: post.grCombineUniforms,
			vertexShader : grCombineShader.vertexShader,
			fragmentShader : grCombineShader.fragmentShader
				
	});
			
	var grFakeSunShader = THREE.ShaderGodRays[ "godrays_fake_sun" ];
	post.grFakeSunUniforms = THREE.UniformsUtils.clone( grFakeSunShader.uniforms );
	post.matGrFakeSun = new THREE.ShaderMaterial({
				
			uniforms: post.grFakeSunUniforms,
			vertexShader: grFakeSunShader.vertexShader,
			fragmentShader: grFakeSunShader.fragmentShader
				
	});
			
	post.grFakeSunUniforms.bgColor.value.setHex( bgColor );
	post.grFakeSunUniforms.sunColor.value.setHex( sunColor );
	post.grCombineUniforms.fGodRayIntensity.value = fogIntensity;
			
	post.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight),
													post.matGrGenerate);
	post.quad.position.z = -9900;
	post.scene.add( post.quad );
	
}

function renderPost(){
				
	// Find the screenspace position of the sun
	screenSpacePosition.copy( sunPosition ).project( camera );

	screenSpacePosition.x = ( screenSpacePosition.x + 1 ) / 2;
	screenSpacePosition.y = ( screenSpacePosition.y + 1 ) / 2;

	// Give it to the god-ray and sun shaders
	post.grGenUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
	post.grGenUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;

	post.grFakeSunUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
	post.grFakeSunUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;

	// -- Draw sky and sun --

	// Clear colors and depths, will clear to sky color
	renderer.clearTarget( post.rtTextureColors, true, true, false );

	// Sun render. Runs a shader that gives a brightness based on the screen
	// space distance to the sun. Not very efficient, so i make a scissor
	// rectangle around the suns position to avoid rendering surrounding pixels.

	var sunsqH = 0.74 * window.innerHeight; // 0.74 depends on extent of sun from shader
	var sunsqW = 0.74 * window.innerHeight; // both depend on height because sun is aspect-corrected

	screenSpacePosition.x *= window.innerWidth;
	screenSpacePosition.y *= window.innerHeight;

	//renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
	//renderer.enableScissorTest( true );

	post.grFakeSunUniforms[ "fAspect" ].value = window.innerWidth / window.innerHeight;

	post.scene.overrideMaterial = post.matGrFakeSun;
	renderer.render( post.scene, post.camera, post.rtTextureColors );

	//renderer.enableScissorTest( false );

	// -- Draw scene objects --

	// Colors

	scene.overrideMaterial = null;
	renderer.render( scene, camera, post.rtTextureColors );

	// Depth

	scene.overrideMaterial = materialDepth;
	renderer.render( scene, camera, post.rtTextureDepth, true );

	// -- Render god-rays --

	// Maximum length of god-rays (in texture space [0,1]X[0,1])
	var filterLen = 1.0;

	// Samples taken by filter
	var TAPS_PER_PASS = 6.0;

	// Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
	// would start with a small filter support and grow to large. however
	// the large-to-small order produces less objectionable aliasing artifacts that
	// appear as a glimmer along the length of the beams

	// pass 1 - render into first ping-pong target
	var pass = 1.0;
	var stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

	post.grGenUniforms[ "fStepSize" ].value = stepLen;
	post.grGenUniforms[ "tInput" ].value = post.rtTextureDepth;
	post.scene.overrideMaterial = post.matGrGenerate;

	renderer.render( post.scene, post.camera, post.rtTextureGR2 );

	// pass 2 - render into second ping-pong target
	pass = 2.0;
	stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

	post.grGenUniforms[ "fStepSize" ].value = stepLen;
	post.grGenUniforms[ "tInput" ].value = post.rtTextureGR2;

	renderer.render( post.scene, post.camera, post.rtTextureGR1  );

	// pass 3 - 1st RT
	pass = 3.0;
	stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

	post.grGenUniforms[ "fStepSize" ].value = stepLen;
	post.grGenUniforms[ "tInput" ].value = post.rtTextureGR1;

	renderer.render( post.scene, post.camera , post.rtTextureGR2  );

	// final pass - composite god-rays onto colors
	post.grCombineUniforms["tColors"].value = post.rtTextureColors;
	post.grCombineUniforms["tGodRays"].value = post.rtTextureGR2;
	
	post.scene.overrideMaterial = post.matGrCombine;

	renderer.render( post.scene, post.camera );
	post.scene.overrideMaterial = null;
}