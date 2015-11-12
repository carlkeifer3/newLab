// JavaScript Document

function initialize(){
	container = document.getElementById('WebGLContainer');
	document.body.appendChild( container );
			
	// camera setup
	camera = new THREE.PerspectiveCamera( 70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.x = 300;
	camera.position.z = 200;
	camera.position.y = 250;

	//control setup
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 20.0;
	controls.zoomSpeed   = 10.2;
	controls.panSpeed    = 0.8;
	controls.noZoom = false;
	controls.noPan  = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 6.0;

	//scene setup
	scene = new THREE.Scene();	
	//scene.fog = new THREE.Fog( 0x33CCFF, 80, 50000);
	scene.add(camera)	
			
	// Light Setup
	//console.log("calling LightSetup()")
	LightSetup(shadMap);		
			
			
	// Renderer Setup
	renderer = new THREE.WebGLRenderer({antialias:true});
	//renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRation);
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";
			
	renderer.gammaInput  = true;
	renderer.gammaOutput = true;
	renderer.sortObjects = false;
			
	container.appendChild( renderer.domElement );
			
	renderer.shadowMap.enabled = true;
			
	// STATS
	stats = new Stats();
	container.appendChild(stats.domElement);
			
	//create Environment Cube
	var path = "../Data/cube/Castle/";
	var format = '.jpg';
	var urls = [
		path + 'px.jpg', path + 'nx.jpg',
		path + 'py.jpg', path + 'ny.jpg',
		path + 'pz.jpg', path + 'nz.jpg' 
	];	
			
	reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
	reflectionCube.format = THREE.RGBFormat;			
			
	// Loading Geometries
	// load spellbook
	//console.log("calling geoLoad() for the spellbook");
	geoLoad( '../Data/spellbook/spellbook.js', "spellbook/spellbook", [0, 68, 0], [0, 0, 0.7], true);
			
	// load bookStand
	//console.log("calling geoLoad() for the book stand");
	geoLoad('../Data/bookstand/bookStand.json', "bookstand/bookStand", [ 0, 0, 0 ], [ 0, 0, 0 ], true);						

	// Alembic Stand
	//console.log("calling geoLoad() for the Alembic stand");
	geoLoad('../Data/AStand/AStand.json', "AStand/AStand", [ 0, 0, 0 ], [ 0, 0, 0 ], true);		

	// Labratory Table
	//console.log("calling geoLoad() for the Laboratory Stand");
	geoLoad('../Data/LabTable/LabTable.json', "LabTable/LabTable", [ 0, 0, 0 ], [ 0, 0, 0 ], true);

	// Laboratory Science Banner
	//console.log("calling geoLoad() for the science banner");
	geoLoad('../Data/banners/BannerS.js', "banners/BannerS", [0,0,0], [0,0,0], true);

	// Laboratory Technology Banner
	//console.log("calling geoLoad() for the technology banner");
	geoLoad('../Data/banners/BannerT.js', "banners/BannerT", [0,0,0], [0,0,0], true);

	// Laboratory Engineering Banner
	//console.log("calling geoLoad() for the Engineering banner");
	geoLoad('../Data/banners/BannerE.js', "banners/BannerE", [0,0,0], [0,0,0], true);

	// Laboratory Math Banner
	//console.log("calling geoLoad() for the math banner");
	geoLoad('../Data/banners/BannerM.js', "banners/BannerM", [0,0,0], [0,0,0], true);

	// Laboratory Red Books
	//console.log("calling geoLoad() for the red books");
	geoLoad('../Data/bookPile/redBooks.js', "bookPile/redBooks", [0,0,0], [0,0,0], true);

	// Laboratory Green Books
	//console.log("calling geoLoad() for the green books");
	geoLoad('../Data/bookPile/greenBooks.js', "bookPile/greenBooks", [0,0,0], [0,0,0], true);

	// Laboratory Blue Books
	//console.log("calling geoLoad() for the blue Books");
	geoLoad('../Data/bookPile/blueBooks.js', "bookPile/blueBooks", [0,0,0], [0,0,0], true);

	// Laboratory Brown Books
	//console.log("calling geoLoad() for the brown Books");
	geoLoad('../Data/bookPile/brownBooks.js', "bookPile/brownBooks", [0,0,0], [0,0,0], true);

	// Laboratory Floor
	//console.log("calling geoLoad() for the Laboratory Floor");
	geoLoad('../Data/LabFloor/LabFloor.json', "LabFloor/LabFloor", [ 0, 0, 0 ], [ 0, 0, 0 ], true);			

	// Laboratory Wall
	//console.log("calling geoLoad() for the Lab wall");
	geoLoad('../Data/labWall/LabWall.js', "labWall/LabWall", [ -45, 5, 0 ], [ 0, 0, 0 ], true);	

	// Laboratory Beams
	//console.log("calling geoLoad() for the lab beams");
	geoLoad('../Data/labBeams/labBeams.js', "labBeams/labBeams", [0,0,0], [0,0,0], true);

	// Wizard-static
	//console.log("calling geoLoad() for the static wizard");
	//geoLoad('../Data/wizard/Wizard.js', "wizard/Wizard", [ -45, 5, 0 ], [ 0, 0, 0 ], true);			


	//Lab Alembic
	//console.log("Loading the Lab Alembic")
	var Alembic = new THREE.JSONLoader();
			
	Alembic.load( '../Data/Alembic.json',function (geometry, materials){
				
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;
				
		var cubeMaterial = new THREE.MeshPhongMaterial({  color : 0x007788, 
   														  envMap: reflectionCube,
														  transparent : true,
														  shininess: 100,
														  opacity : 0.3,
														  refractionRatio: 0.95 });
		
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, cubeMaterial );
		
		mesh.position.set( 0, 0, 0);
		mesh.scale.set( 20, 20, 20 );
		scene.add(mesh);
			
		mesh.castShadow = true;
		mesh.receiveShadow = true;	
	
	});	
	
	// Alembic Potion
	console.log("loading the alembic potion")
	var APotion = new THREE.JSONLoader();
								
	APotion.load( '../Data/APotion/APotion.json',function (geometry, materials){
				
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;
					
			
		var cubeMaterial = new THREE.MeshBasicMaterial({ color : 0xDD2200, 
														  envMap: reflectionCube,
														  transparent : true,
														  opacity : 0.8,
														  refractionRatio: 0.95 });
				
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, cubeMaterial );
				
		mesh.position.set( 0, 0, 0);
		mesh.scale.set( 20, 20, 20 );
		scene.add(mesh);
			
		mesh.castShadow = true;
		mesh.receiveShadow = true;	
			
	});

	// load Lab Beams		
	var labXbeams = new THREE.JSONLoader();
			
	labXbeams.load( '../Data/labXbeams.js',function (geometry, materials){
			
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;
					
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial({
		
				color: 0x222222
				
			}));//new THREE.MeshFaceMaterial( materials ));
		mesh.position.set( 0, 0, 0);
		mesh.scale.set( 20, 20, 20 );
		scene.add(mesh);
			
		mesh.castShadow = true;
		mesh.receiveShadow = true;				
							
	});			
	
	// load Lab Roof		
	var labRoof = new THREE.JSONLoader();
			
	labRoof.load( '../Data/labRoof.js',function (geometry, materials){
			
		geometry.computeBoundingBox();
		var bb = geometry.boundingBox;
					
		// Define the materials for our mesh
		mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshPhongMaterial({
		
				color: 0x222222
				
			}));//new THREE.MeshFaceMaterial( materials ));
		mesh.position.set( 0, 0, 0);
		mesh.scale.set( 20, 20, 20 );
		scene.add(mesh);
			
		mesh.castShadow = true;
		mesh.receiveShadow = true;				
							
	});						
		
	animatedGeoLoader();

	// plane added for the picking to work
	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
		new THREE.MeshBasicMaterial( { visible: false } )	
	);
	scene.add( plane );
						
	// Particle initialization
	var particles = new THREE.Geometry;
	
	for( var p = 0; p < 2000; p++){
		var particle = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 -250, Math.random() * 1000 - 500);
		particles.vertices.push(particle);
	}
	
	var dustMaterial = new THREE.ParticleBasicMaterial({ color: 0xEEEEEE, 
														 transparent: true, 
														 blending: THREE.AdditiveBlending,
														 size: 2 });
	
	dustSystem = new THREE.ParticleSystem(particles, dustMaterial);
	scene.add(dustSystem);
	
	// GUI
			
	//initGUI();
			
	// mouse events
	renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
			
	// window Resize
	window.addEventListener( 'resize', onWindowResize, false);


	initPost();
				
}