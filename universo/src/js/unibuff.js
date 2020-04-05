//=====================================================
//========================= var setup =================
//=====================================================
var contador_galaxias  = 0;
// contador_galaxias = MAX_GALAXIAS;
var contador_ciclos    = 0;
var tot_estrellas      = 0;
var estrellas          = [];
var direcciones        = [];
var scene, renderer;
var MAX_ESTRELLAS = 300001;
const FRECUENCIA_FLARE = 800; // mayor num menor frecuencia
var ritmo_crecimiento = 50;

var dibuja_estrella_fugaz = false;

// Set up the sphere vars
const RADIUS = 50;
const SEGMENTS = 5;
const RINGS = 5;

// Rotation variables

var rotate_x = 1;
var rotate_y = 1;
var rotate_z = 2;
var rotation_variable = 0.0001;

rotate_x = randomFromInterval(-1,1);
rotate_y = randomFromInterval(-3,1);
rotate_z = randomFromInterval(-1,1);

// Orbita de la camara
var theta = 0; // [ -pi/1, pi/2 ]
var phi   = Math.PI/2;      // [ -pi, pi ]
var lon = 0;
var lat = 0;


// Variables mesh de estrellas
var universo, geom, pos, cols, tams, shaderMaterial;
// forma del unverso
var forma_universo = 0;

// distribucion colores
var colour_dist = calc_colour_dist();
console.log(colour_dist);

// variables de tamanio
var width = window.innerWidth;
var height = window.innerHeight;

// variables estrella fugaz	
var x_init = randomFromInterval(-width/6, width/6);
var y_init = randomFromInterval(-height/6,height/6);
var z_init = randomFromInterval(-100, 100);

var x_fin = randomFromInterval(-width/6, width/6);
var y_fin = randomFromInterval(-height/6,height/6);
var z_fin = randomFromInterval(-100, 100);

var estrella_fugaz_transitando = false;
var RITMO_FUGAZ = 1000;
var vel_fugaz = 5;

const MAX_SEGMENTOS = 100;
var segmento = 0;
var l_max = 1 + 4*Math.random();
var geometria, posiciones, estrella_fugaz;

// CONTADOR REFRESH
var contador_refresh = 0;
var ciclos_refresh = randomFromInterval(600,10000); // 60 fps teoria



//
var j = true;

// create sprite for disc
var sprite = new THREE.TextureLoader().load( 'img/disc.png' );

//=====================================================
//========================= move camera ===============
//=====================================================
function continuous_motion(){
	var increase = 0.008;
	var rot_increase = 0.0002;
	
	//lat += increase;
	lon += increase;
	
	// camera.rotation.x += rot_increase;
	// camera.rotation.y += rot_increase;
	
	recalc_angles();
	move_camera();
}

function recalc_angles(){
	// theta is from 0 to 2*PI
	// phi is from -PI/2 to PI/2
	
	// lat = Math.max( - 85, Math.min( 85, lat ) );
	
	
    phi = ( 90 - lat ) * Math.PI / 180;
    theta = lon * Math.PI / 180;
}
	
function move_camera(){
	var r = Math.sqrt(camera.position.x*camera.position.x + camera.position.y*camera.position.y + camera.position.z*camera.position.z);
	
	
	
	camera.position.x = r*Math.cos(theta)*Math.sin(phi);
	camera.position.z = r*Math.sin(theta)*Math.sin(phi);
	camera.position.y = r*Math.cos(phi);
	
	// console.log(camera.position.x, camera.position.y, camera.position.z);
	
	// camera.lookAt(scene.position);	
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
	var rotation_const = 0.01;
	var translation_const = Math.PI/100;
	
    var keyCode = event.which;
    // console.log(keyCode);
    if (keyCode == 37) { // gira izquerda // arrow
        camera.rotation.y += rotation_const;
    } else if (keyCode == 38) { // gira arriba // arrow
        camera.rotation.x += rotation_const;
    } else if (keyCode == 39) { // gira derecha // arrow
        camera.rotation.y -= rotation_const;
    } else if (keyCode == 40) { // gira abajo // arrow
        camera.rotation.x -= rotation_const;
    } else if (keyCode == 173) { // zoom out  ///Gets or sets the zoom factor of the camera. Default is 1. // -
    		camera.translateZ(10);
    } else if (keyCode == 61){ // zoom in // =
    		camera.translateZ(-10);
    } else if (keyCode == 69){ // translate up // e
    		lat += 1;
    		recalc_angles();
    		move_camera();
    } else if (keyCode == 83){ // translate left // s
    		lon += 1;
    		recalc_angles();
    		move_camera();
    } else if (keyCode == 68){ // translate down// d
    		lat -= 1;
    		recalc_angles();
    		move_camera();
    } else if (keyCode == 70){ // translate right // f
    		lon -= 1;
    		recalc_angles();
    		move_camera();
    } else if (keyCode == 82){ // reset universe // r
    		resetUniverse();
    		// document.getElementById('info').innerHTML = "";
    } else if (keyCode == 219){ // dolly in // [
    		camera.zoom += 0.1;
    		console.log(camera.zoom);
    } else if (keyCode == 221){ // dolly out // ]
    		camera.zoom -= 0.1;
    		console.log("\n\n\n\n\n\n\n\n\n" + camera.zoom + "\n\n\n\n\n\n\n\n\n");
    }
    camera.updateProjectionMatrix();
};
//=====================================================
//========================= init ======================
//=====================================================
(function init() {
	window.addEventListener('resize', onResize, false);
	window.addEventListener('dblclick', function(){
	  resetUniverse();
	  document.getElementById('info').innerHTML = "";
	}, false); 
	
	renderer = initRenderer({
		antialias : true,
		alpha : true
	});

	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
	// camera.position.x = -20;
	// camera.position.y = 10;
	camera.position.z = -100;
	// camera.lookAt(new THREE.Vector3(0, 0, 0));
	// camera.rotation.z = Math.PI;

	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();

	// camera.lookAt(scene.position);
	
	continuous_motion();
	if (Math.random() > 0.2){
		camera.lookAt(scene.position);
	}
	// 
	// orbitalControls = new THREE.OrbitControls(camera, renderer.domElement);
// 	
	// Create sun
	addLensFlare(0,0,0, 100, 0);
	// orbitalControls.update();
	
	
	// VARIABLES PARA ESTRELLAS NORMALES------
	// // uniforms
    // var uniforms = {
// 
        // color: { type: "c", value: new THREE.Color( 0xFFFFFF ) },
// 
    // };
	shaderMaterial = new THREE.ShaderMaterial( {

        // uniforms:       uniforms,
        
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        transparent:    false

    });
	
	
	geom = new THREE.BufferGeometry();
	pos = new Float32Array( MAX_ESTRELLAS*3 ); // 3 valores por punto (x, y, z)
	cols = new Float32Array( MAX_ESTRELLAS*3 ); // 3 valores por punto (x, y, z)
	tams = new Float32Array( MAX_ESTRELLAS ); // 1 valor por punto
	
	geom.addAttribute( 'position', new THREE.BufferAttribute( pos, 3 ) );
	geom.addAttribute( 'color', new THREE.BufferAttribute( cols, 3 ) );
	geom.addAttribute( 'size', new THREE.BufferAttribute( tams, 1 ).setDynamic( true ) );
	
	geom.setDrawRange( 0, 0 );
	
	// var dotMaterial = new THREE.PointsMaterial({ sizeAttenuation: false, color: 0xFFFFFF, vertexColors:0xFFFFFF, depthWrite:false, depthTest:true, size:1});
	universo = new THREE.Points( geom, shaderMaterial);
	scene.add(universo);
	calculaUniverso();
	
	//----------------------------------------
	
	
	// VARIABLES PARA ESTRELLA FUGAZ----------
	geometria = new THREE.BufferGeometry();
	// attributes
	posiciones = new Float32Array( MAX_SEGMENTOS*3 ); // 3 valores por punto (x, y, z)
	colores = new Float32Array( MAX_SEGMENTOS*3 ); // 3 valores por punto (x, y, z)
	geometria.addAttribute( 'position', new THREE.BufferAttribute( posiciones, 3 ) );
	
	
	// drawcalls
	geometria.setDrawRange( 0, 0 );

	// material
	var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, linewidth: 1 } );

	// line
	estrella_fugaz = new THREE.Line( geometria,  material );
	scene.add( estrella_fugaz );

	// update positions
	calculaEstrellaFugaz();
	//-----------------------------------------
	// render
	render();
	// crea_estrella_esfera(0, 0, 0);
})();	
//=====================================================
//========================= fetch colour ==============
//=====================================================
	function fetch_colour(){
		
		var c = Math.random();
		var colour = [];
		if (c < colour_dist[0]){
			//blanco
			colour[0] = 1;
			colour[1] = 1;
			colour[2] = 1;
		}else if(c < colour_dist[1]){
			//rojo
			colour[0] = 28/255;
			colour[1] = 62/255;
			colour[2] = 139/255;
		}else if(c < colour_dist[2]){
			//verde
			colour[0] = 144/255;
			colour[1] = 67/255;
			colour[2] = 18/255;
		}else{
			//cyan
			colour[0] = 254/255;
			colour[1] = 210/255;
			colour[2] = 72/255;			
		}
		return colour;
	}

//=====================================================
//========================= calcula distr color =======
//=====================================================
function calc_colour_dist(){
	var dist = Math.random();
	var col;
	if ( dist > 0.5 ){
		col = [0.9, 0.92, 0.97];
	}else{
		
		var c1 = Math.random();
		var c2 = randomFromInterval(c1, 1);
		var c3 = randomFromInterval(c2, 1);
		
		col = [c1, c2, c3];
	}
	
	return col;
}

//=====================================================
//========================= calcula coords rect =======
//=====================================================
function coords_rect(){
	var x_coord = randomFromInterval(-width/6, width/6);
	var y_coord = randomFromInterval(-height/6,height/6);
	var z_coord = randomFromInterval(-300, 300);
	
	return [x_coord, y_coord, z_coord];
}

//=====================================================
//========================= calcula coords esfera =====
//=====================================================
function coords_sphere() {
    var theta = Math.random() * 2.0*Math.PI;
    var phi = Math.random() * Math.PI;
    var r = (width/6)*Math.random();
    var sinTheta = Math.sin(theta); var cosTheta = Math.cos(theta);
    var sinPhi = Math.sin(phi); var cosPhi = Math.cos(phi);
    var x = r * sinPhi * cosTheta;
    var y = r * sinPhi * sinTheta;
    var z = r * cosPhi;

    return [x, y, z];
    
}


//=====================================================
//========================= calcula coords piramide ===
//=====================================================

//=====================================================
//========================= calcula universo ==========
//=====================================================
	
	function calculaUniverso(){
		var x, y, z;
		var c1, c2, c3; // colour variables
		var size, coords;
		
		// update positions
		var positions = universo.geometry.attributes.position.array;
		// update colors
		var colors = universo.geometry.attributes.color.array;
		// update sizes
		var sizes = universo.geometry.attributes.size.array;
		
		
		var index = 0;
	
		for ( var i = 0, l = MAX_ESTRELLAS; i < l; i ++ ) {
	
			// positions
			if ( forma_universo == 0 ){
				coords = coords_rect();
			}else{
				coords = coords_sphere();
			};
			
			
			
			
			x = coords[0];
			y = coords[1];
			z = coords[2];
			
			// colors
			[c1, c2, c3] = fetch_colour();
			// console.log(c1, c2, c3);
			
			//set pos and cols
			positions[ index ++ ] = x;
			colors[ index ] = c1;
			positions[ index ++ ] = y;
			colors[ index ] = c2;
			positions[ index ++ ] = z;
			colors[ index ] = c3;
			
			// sizes
			var type = Math.random();
			if(type > 0.1){
				size = Math.random();
			}else{
				size = 1 + 2*Math.random();
			}
			
			sizes[i] = size;
		}

	}
	
	function dibujaUniverso(){
		universo.geometry.setDrawRange(0, contador_galaxias);
		
	}

	function resetUniverse(){
		universo.geometry.setDrawRange(0, contador_galaxias);
		calculaUniverso();
		contador_galaxias = 0;
		
		// forma del universo
		if (Math.random() < 0.5){
			forma_universo = 0;
		}else{
			forma_universo = 1;
		}
		
		// color del universo
		colour_dist = calc_colour_dist();
		
		
		// camera.lookAt(scene.position);
		
		
		camera.lookAt(scene.position);
		if (Math.random() > 0.6){
			camera.rotation.y = Math.PI;
		}
		
		universo.geometry.attributes.position.needsUpdate = true;
		universo.geometry.attributes.color.needsUpdate = true;
		universo.geometry.attributes.size.needsUpdate = true;
		
		// change camera rotation
		// rotate_x = 0;
		// rotate_y = 0;
		// rotate_z = 2;
		rotate_x = randomFromInterval(-1,1);
		rotate_y = randomFromInterval(-3,1);
		rotate_z = randomFromInterval(-1,1);
		rotation_variable = randomFromInterval(0.00005, 0.0007);
		// change zoom
		// var zoom_change = randomFromInterval(-5,2);
		camera.zoom = randomFromInterval(0,0.5);
		
		ritmo_crecimiento = Math.ceil(randomFromInterval(0.001,100));
		

		MAX_ESTRELLAS = Math.ceil(randomFromInterval(1000, 300001));
		
		// quita flares
		var flare;
		for (var i = scene.children.length -1; i >=0; i--){
			obj = scene.children[ i ];
			// console.log(obj.name);
		    // if ( obj !== plane && obj !== camera) {
		        // scene.remove(obj);
		    // }
			
			flare = scene.getObjectByName(i);
			scene.remove( flare );
		}
		estrellas = [];
		
		// crea sol
		addLensFlare(0,0,0, 100, 0);
		
	}
//=====================================================
//========================= crea estrella fugaz ======
//=====================================================
	
	function calculaEstrellaFugaz(){
		x_init = randomFromInterval(-width/6, width/6);
		y_init = randomFromInterval(-height/6,height/6);
		z_init = randomFromInterval(-10, 10);
		
		// x_fin = randomFromInterval(-width/6, width/6);
		// y_fin = randomFromInterval(-height/6,height/6);
		// z_fin = randomFromInterval(-10, 10);
		var k = 40;
		x_fin = x_init + randomFromInterval(-k,k);
		y_fin = y_init + randomFromInterval(-k,k);
		z_fin = z_init + randomFromInterval(-1,1);
		
		// segmento = 0;
		// l_max = 1 + 4*Math.random();
		l_max = 1 + 2*Math.random();
		
		// Dividir en n segmentos y número de segmentos por paso
		// var segmentos = 20;
		// var seg_paso = 3;
		// var seg_lambda = l_max / segmentos;
// 		
		// calcular vector de direccion
		var x_dir = x_fin - x_init;
		var y_dir = y_fin - y_init;
		var z_dir = z_fin - z_init;
		// var z_dir = 0;
		
		// update positions
		var positions = estrella_fugaz.geometry.attributes.position.array;
		
		var x = x_init;
		var y = y_init;
		var z = z_init;
		var index = 0;
	
		for ( var i = 0, l = MAX_SEGMENTOS; i < l; i ++ ) {
	
			positions[ index ++ ] = x;
			positions[ index ++ ] = y;
			positions[ index ++ ] = z;
	
			x = x_init + x_dir*l_max*(i+1)/MAX_SEGMENTOS;
			y = y_init + y_dir*l_max*(i+1)/MAX_SEGMENTOS;
			z = y_init + y_dir*l_max*(i+1)/MAX_SEGMENTOS;
	
		}
	
	}


	function dibujaEstrellaFugaz() {
		// console.log("dibujando estrella fugaz");
		
		segmento = ( segmento + vel_fugaz) % MAX_SEGMENTOS;
		
		estrella_fugaz.geometry.setDrawRange( segmento - 2, segmento);
		
		
		if(segmento == 0){
			l_max = 0;
			estrella_fugaz_transitando = false;
			estrella_fugaz.geometry.setDrawRange(0, 0);
			calculaEstrellaFugaz();
			estrella_fugaz.geometry.attributes.position.needsUpdate = true;
			
		}
		
		
	}

//=====================================================
//========================= move stars ================
//=====================================================
	function moveStars(){ // PENDIENTE
		var i, magnitud;
		
		magnitud = 0.000001*Math.random();
		for(i=0; i<estrellas.length; i++){
			estrellas[i].scale = magnitud;
			if (estrellas[i].isLensflare){
				estrellas[i].scale = magnitud;
				// console.log("Lens flare");
			}else{
				estrellas[i].position.add(direcciones[i].clone().multiplyScalar(magnitud));
				// console.log(estrellas[i].type); 
			}
			
		}
	}

//=====================================================
//========================= lens flare ================
//=====================================================
	function addLensFlare(x,y,z, size, type){
		
		var textureLoader = new THREE.TextureLoader();
		var colour        = fetch_colour();
		var flareColor    = new THREE.Color(colour[0], colour[1], colour[2]);
		
		
		cont = estrellas.length;
		if (type == 0){ // sun
			var textureFlare0 = textureLoader.load('img/galaxy3.png');
			estrellas[cont] = new THREE.LensFlare(textureFlare0, size, 0.0, THREE.AdditiveBlending, flareColor);
		}else{
			var flare = Math.random();
			
			if( flare < 0.5 ){
				var textureFlare0 = textureLoader.load('img/galaxy3.png');
				estrellas[cont] = new THREE.LensFlare(textureFlare0, size, 0.0, THREE.AdditiveBlending, flareColor);
			}else if( flare < 0.75 ){
				var textureFlare1 = textureLoader.load('img/galaxy1.png');
				estrellas[cont] = new THREE.LensFlare(textureFlare1, size, 0.0, THREE.AdditiveBlending, flareColor);
			}else{
				var textureFlare2 = textureLoader.load('img/galaxy2.png');
				estrellas[cont] = new THREE.LensFlare(textureFlare2, size, 0.0, THREE.AdditiveBlending, flareColor);
			}
		}
		
		
		// var lensflare = new THREE.LensFlare(textureFlare0, size, 0.0, THREE.AdditiveBlending, flareColor);
		// estrellas[cont] = new THREE.LensFlare(textureFlare0, size, 0.0, THREE.AdditiveBlending, flareColor);
		// lensflare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
		// lensflare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
		// lensflare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
		// lensflare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);	
	
		estrellas[cont].name = cont;
		estrellas[cont].position.set(x, y, z);
		direcciones[cont] = estrellas[cont].position.clone().sub(camera.position).normalize();
		// lensflare.size = size;
		scene.add(estrellas[cont]);
		
		// cont = estrellas.length;
		// estrellas[cont] = lensflare;
		// scene.add(estrellas[cont]);
		// direcciones[cont] = estrellas[cont].position.clone().sub(camera.position).normalize();
	}


//=====================================================
//========================= rotate camera =============
//=====================================================
	function rotateCamera(){
		camera.rotation.x += rotate_x*rotation_variable;
		camera.rotation.y += rotate_y*rotation_variable;
		camera.rotation.z += rotate_z*rotation_variable;
		
		// camera.rotation.x += -0.001;
		// camera.rotation.y += -0.001;
		// camera.rotation.z += -	0.001;
		
		// ellipspoid formula x^2/a^2 + y^2/b^2 + z^2/c^2 = 1; a, b, c are positive real numbers
		// parameterization of an ellipsoid
		// x = a*cos(theta)*cos(phi)
		// y = b*cos(theta)*sin(phi)
		// z = c*sin(theta)
		// var a = 1;
		// var b = 1;
		// var c = 1;
// 		
		// theta = 0;      // [ -pi/1, pi/2 ]
		// phi   = 0;      // [ -pi, pi ]
// 
// 		
// 		
		// camera.position.x += 1;
		// camera.position.y += 1;
		// camera.position.z += 1;
	}
//=====================================================
//========================= render ====================
//=====================================================
	function render() {
		
		// console.log(camera.zoom);
		
		width = window.innerWidth;
		height = window.innerHeight;
		
		// console.log(contador_galaxias);
		
		contador_ciclos ++;
		rotateCamera();
		// moveStars();
		
		if (contador_refresh >= ciclos_refresh){
			resetUniverse();
    			// document.getElementById('info').innerHTML = "";
    			contador_refresh = 0;
    			ciclos_refresh = randomFromInterval(600, 10000);
		}else{
			contador_refresh ++;
		}
		console.log(contador_refresh, Math.floor(ciclos_refresh));
		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		continuous_motion();
		var i;
		// aumenta el total de estrellas
		if (contador_galaxias < MAX_ESTRELLAS){
			contador_galaxias += ritmo_crecimiento;
			console.log("Cantidad de galaxias/estrellas en el universo: ", contador_galaxias);
		}
		dibujaUniverso();
		// agrega flares
		if (contador_galaxias % FRECUENCIA_FLARE == 0){
			var x = randomFromInterval(-width/6, width/6);
			var y = randomFromInterval(-height/6,height/6);
			var z = randomFromInterval(-300, 300);
			var size = randomFromInterval(15, 50	);
			var type = Math.random();
			addLensFlare(x, y, z, size, type);
		}
		
		// cosas para estrella fugaz
		if (contador_ciclos % RITMO_FUGAZ == 0){
			estrella_fugaz_transitando = true;
		}
		if (estrella_fugaz_transitando){
			// console.log("fugaz");
			dibujaEstrellaFugaz();
		}
		// camera.lookAt(scene.position);
		// addLensFlare(200, 10, -500, 1);
		// addLensFlare(300, 20, -500, 1);
// 		
	}
//=====================================================
//========================= on resize =================
//=====================================================
	function onResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

//=====================================================
//========================= rand from int =============
//=====================================================
function randomFromInterval(min,max)
{
    return Math.random()*(max-min)+min;
}

//=====================================================
//========================= init renderer =============
//=====================================================
function initRenderer(additionalProperties) {

	var props = ( typeof additionalProperties !== 'undefined' && additionalProperties) ? additionalProperties : {};
	var renderer = new THREE.WebGLRenderer(props);

	renderer.setClearColor(new THREE.Color(0x000000));
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	document.getElementById("container").appendChild(renderer.domElement);

	return renderer;
}

//=====================================================
//========================= add light =================
//=====================================================
function addLight(scene, h, s, l, x, y, z) {
	THREE.ImageUtils.crossOrigin = '';
	var textureFlare0 = THREE.ImageUtils.loadTexture('https://s3.amazonaws.com/jsfiddle1234/lensflare0.png');

	var light = new THREE.PointLight(0xffffff, 1.5, 10);
	light.color.setHSL(h, s, l);
	light.position.set(x, y, z);
	scene.add(light);
	light = light;

	var flareColor = new THREE.Color(0xffffff);
	flareColor.setHSL(h, s, l + 0.5);

	var lensFlare = new THREE.LensFlare(textureFlare0, 200, 0.0, THREE.AdditiveBlending, flareColor);

	lensFlare.position.copy(light.position);
	var lensFlare = lensFlare;

	scene.add(lensFlare);

}
