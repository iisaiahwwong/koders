$(function () {
	init();
})
/**
 * THREE JS SETUP
 * Using CSS Renderer and WebGL Renderer
 */

var camera, sceneGL, sceneCss, rendererGL, rendererCss, controls, stats, composer;

var mouse, raycaster;

var graphicContainer;

const
	WHITE_THEME = 0xE6EAEB,
	BLACK_THEME = 0x0B141B;

function init() {
	/** Camera */
	// Initialize THREEjs Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.5, 1000 );
	camera.position.z = 1;
	camera.position.y = 0;

	/** Get ID of div */
	graphicContainer = document.getElementById('graphic-container');

	/** Renderers */
	// GL Renderer
	rendererGL = new THREE.WebGLRenderer({ antialias: true });
	rendererGL.setSize(window.innerWidth, window.innerHeight);
	rendererGL.setClearColor(BLACK_THEME, 1);
	rendererGL.domElement.style.zIndex = 5;
	graphicContainer.appendChild(rendererGL.domElement);

	// CSS3D Renderer
	rendererCss = new THREE.CSS3DRenderer();
	rendererCss.setSize(window.innerWidth, window.innerHeight);
	rendererCss.domElement.style.position = 'absolute';
	rendererCss.domElement.style.top = '0px';
	rendererCss.domElement.className = 'cssRenderer';
	//graphicContainer.appendChild(rendererCss.domElement);

	/** Scenes */
	// GL Scene
	sceneGL = new THREE.Scene();

	// CSS3D Scene
	sceneCss = new THREE.Scene();

	/** Click Controls */
	mouse = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	// document.addEventListener('mousemove', onDocumentMouseMove, false);
	// document.addEventListener('touchstart', onDocumentTouchStart, false);
	// document.addEventListener('mousedown', onDocumentMouseDown, false);

	/** Camera Controls */
	// controls = new THREE.TrackballControls(camera);

	controls = new THREE.OrbitControls(camera);
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;

	/** Start Graphics */
	// composer = compose();

	/** Initialize Stats */
	stats = new Stats();
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

	// Align top-right
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0';
	stats.domElement.className = 'stats';
	// graphicContainer.appendChild(stats.domElement);

	// Resize renderers when page is changed
	window.addEventListener('resize', onWindowResize, false);
	animate();
	
	// genPointCloud();
	// initSentimentVisual();

	initMap();

}

/**
 * Renders all renderers
 */
function render() {
	rendererCss.render(sceneCss, camera);
	rendererGL.render(sceneGL, camera);
}

/**
 * Change the page aspect ratio and size based on user's browser
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	rendererGL.setSize(window.innerWidth, window.innerHeight);
	rendererCss.setSize(window.innerWidth, window.innerHeight);

	render();
}

function animate() {
	requestAnimationFrame(animate);
	// stats.begin();

	// Monitored code goes here
	TWEEN.update();
	render();
	controls.update();
	// stats.end();
}

function initVisual() {
	// 	var line = drawCubicBezier({
	// 		startObject: new THREE.Vector3(0, 0, 0),
	// 		endObject: new THREE.Vector3(200, 200, 0),
	// 		color: 0xff0000
	//    	});
	//    animateLine(line, line.points.length, 1);

	var circle = VISUAL.drawCircle({
		startObject: new THREE.Vector3(0, 0, 0),
		color: 0xffffff,
		resolution: 361,
		startAngle: 0,
		radius: 300
	});

	VISUAL.animateLine(circle, circle.points.length, 2);
}


function initSelection() {
	var circle = new VISUAL.Circle().drawBorderCircle({
		startPosition: new THREE.Vector3(0, 0, 0),
		color: 0x1A5E75,
		resolution: 361,
		startAngle: 0,
		radius: 200
	});

	VISUAL.animateLine(circle, circle.points.length, 2);

}


function toRadians(angle) {
	return angle * Math.PI / 180;
}

/**
 * TEMPLATE FOR SENTIMENT ANALYSIS
 * 
 * DRAW THREE SPACES
 */

/* ---------------------------------------------------
    MODELS
----------------------------------------------------- */
function tweet() {
	this.emotion;
	this.scale;
	this.timestamp;
}

/* ---------------------------------------------------
    LAYOUTS
----------------------------------------------------- */

function initSentimentVisual() {
	defineArea();
	eventListener();
}

let POSITIVE_AREA, NEGATIVE_AREA, NEUTRAL_AREA;

function defineArea() {

	POSITIVE_AREA = new VISUAL.Circle().drawCircle({
		startPosition: new THREE.Vector3(-4500, 0, 0),
		color: 0x1071AD,
		opacity: 0.0,
		radius: 2500,
	});

	NEGATIVE_AREA = new VISUAL.Circle().drawCircle({
		startPosition: new THREE.Vector3(0, 0, 0),
		color: 0xF54907,
		opacity: 0.0,
		radius: 2500
	});

	NEUTRAL_AREA = new VISUAL.Circle().drawCircle({
		startPosition: new THREE.Vector3(3500, 0, 0),
		color: 0x191D42,
		opacity: 0.0,
		radius: 2 - 00
	});

	POSITIVE_AREA.scale.set(0.1, 0.1, 0.1);
	NEGATIVE_AREA.scale.set(0.1, 0.1, 0.1);
	NEUTRAL_AREA.scale.set(0.1, 0.1, 0.1);

	enableOverlay(POSITIVE_AREA, 0.1);
	enableOverlay(NEGATIVE_AREA, 0.2);
	enableOverlay(NEUTRAL_AREA, 0.3);

	sceneGL.add(POSITIVE_AREA);
	sceneGL.add(NEGATIVE_AREA);
	sceneGL.add(NEUTRAL_AREA);

}

function enableOverlay(node, order) {
	node.renderOrder = order;

	node.material.polygonOffset = true;
	node.material.depthTest = true;
	node.material.depthWrite = true;
	node.material.polygonOffsetFactor = -10;
	node.material.polygonOffsetUnits = 0;
}

function drawNodes(options) {

	let x = options.x, y = options.y, z = options.z;
	let color = options.color;
	let opacity = options.opacity;
	let radius = options.radius;

	let node = new VISUAL.Sphere().drawSphere({
		startPosition: new THREE.Vector3(x, y, z),
		color: color,
		opacity: opacity,
		radius: radius
	});

	if (typeof options.addToScene !== 'undefined')
		if (options.addToScene) sceneGL.add(node);

	return node;

}

function addCSSLabel() {
}

function grow(node, size) {

	new TWEEN.Tween(node.scale)
		.to({ x: size, y: size, z: size }, 2000)
		.easing(TWEEN.Easing.Exponential.In)
		.start();

	return;

}

function addThenGrow(node, object, size) {

	if (!(object instanceof THREE.Object3D)) {
		console.warn('Not an instance of THREE.Object3D');
		return;
	}

	new TWEEN.Tween(node.scale)
		.to({ x: size, y: size, z: size }, 2000)
		.onUpdate(() => { sceneGL.add(object) })
		.easing(TWEEN.Easing.Exponential.In)
		.start();

	return;

}


function genPointCloud() {

	let particleCount = 1000;

	let positions = new Float32Array(particleCount * 3);
	let colors = new Float32Array(particleCount * 3);
	let sizes = new Float32Array(particleCount);

	let geometry = new THREE.BufferGeometry();

	var vertex;
	var color = new THREE.Color();

	for (i = 0; i < particleCount; i++) {

		let vertex = new THREE.Vector3();
		let theta = THREE.Math.randFloatSpread(360);
		let phi = THREE.Math.randFloatSpread(360);

		vertex.x = particleCount * Math.sin(theta) * Math.cos(phi);
		vertex.y = particleCount * Math.sin(theta) * Math.sin(phi);
		vertex.z = particleCount * Math.cos(theta);

		vertex.toArray(positions, i * 3);

		color.setHSL(0.01 + 0.1 * (i / 1000), 1.0, 0.5);
		color.toArray(colors, i * 3);

		sizes[i] = 10 * 0.5;
	}

	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
	geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));


	let material = new THREE.PointsMaterial({
		size: 10,
		color: 0xff0000
	});

	particles = new THREE.Points(geometry, material);


	sceneGL.add(particles);

}

function changeOpacity(material, opacity) {

	new TWEEN.Tween(material)
		.to({ opacity: opacity }, 1000)
		.easing(TWEEN.Easing.Exponential.In)
		.start();

	return;

}

/* ---------------------------------------------------
    DATA STREAM
----------------------------------------------------- */

function eventListener() {
	let angle = 0;
	let previousNode;
	let arr = [];

	for (var i = 0; i < 2500 / 130; i++) {

		let offset = (2000 - Math.random() * (500 - 40) + 40);

		var x = POSITIVE_AREA.position.x + (offset * Math.cos(toRadians(angle)));
		let y = POSITIVE_AREA.position.y + (offset * Math.sin(toRadians(angle)));

		let node = drawNodes({
			x: x, y: y, z: 0,
			color: 0xffffff,
			opacity: 1,
			radius: Math.random() * (50 - 20 + 1) + 50
		});

		arr.push(node.position);

		// changeOpacity(POSITIVE_AREA.material, 1);
		addThenGrow(POSITIVE_AREA, node, 1);

		var circle = new VISUAL.Circle().drawBorderCircle({
			startPosition: new THREE.Vector3(POSITIVE_AREA.position.x, POSITIVE_AREA.position.y, 0),
			color: 0x24FAFA,
			resolution: 361,
			startAngle: 0,
			radius: 2500
		});

		VISUAL.animateLine(circle, circle.points.length, 2);

		x = NEGATIVE_AREA.position.x + (offset * Math.cos(toRadians(angle)));
		y = NEGATIVE_AREA.position.y + (offset * Math.sin(toRadians(angle)));

		node = drawNodes({
			x: x, y: y, z: 0,
			color: 0xffffff,
			opacity: 1,
			radius: Math.random() * (50 - 20 + 1) + 50
		});

		var circle = new VISUAL.Circle().drawBorderCircle({
			startPosition: new THREE.Vector3(NEGATIVE_AREA.position.x, NEGATIVE_AREA.position.y, 0),
			color: 0xff00000,
			resolution: 361,
			startAngle: 0,
			radius: 2500
		});

		VISUAL.animateLine(circle, circle.points.length, 2);

		// changeOpacity(NEGATIVE_AREA.material, 0.0);
		addThenGrow(NEGATIVE_AREA, node, 1);

		angle += 10;
	}

	let line = VISUAL.connectNodesLines(arr, 0xffffff);

	VISUAL.animateLine(line, line.points.length, 0.05);

}

/* ---------------------------------------------------
	INTERACTION LISTENER
----------------------------------------------------- */

var particles;

function onDocumentTouchStart(event) {
	event.preventDefault();

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseMove(event);

}

var INTERSECTED;


function onDocumentMouseMove(event) {

	setUpRaycaster(event);

	var geometry = particles.geometry;
	var attributes = geometry.attributes;
	
	var intersects = raycaster.intersectObject(particles);

	console.log(intersects);

	if (intersects.length > 0) {

		INTERSECTED = intersects[0].index;

		attributes.size.array[INTERSECTED] = 10;
		attributes.size.array[INTERSECTED] = 10 * 1.25;
		attributes.size.needsUpdate = true;

	}
	else { // No interaction

		INTERSECTED = null;
		
	}
}

function onDocumentMouseDown(event) {
	setUpRaycaster(event);

	var intersects = raycaster.intersectObject(particles);

	if (intersects.length > 0) {
		INTERSECTED = intersects[0].object;
		// showObject(INTERSECTED);
	}
	else { // No interaction
		INTERSECTED = null;
	}
}

function setUpRaycaster(event) {
	event.preventDefault();

	mouse.x = (event.clientX / rendererGL.domElement.width) * 2 - 1;
	mouse.y = - (event.clientY / rendererGL.domElement.height) * 2 + 1;

	// console.log('X | ' + mouse.x);
	// console.log('Y | ' + mouse.y);

	raycaster.setFromCamera(mouse, camera);
}

function initMap() {
	var planet = new THREE.Object3D();

	//Create a sphere to make visualization easier.
	var geometry = new THREE.SphereGeometry(10, 32, 32);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		wireframe: true,
		transparent: true
	});
	material.opacity = 0;

	var sphere = new THREE.Mesh(geometry, material);

	planet.add(sphere);

	//Draw the GeoJSON
	$.getJSON("/geojson/countries_states.geojson", function (data) {
		drawThreeGeo(data, 10, 'sphere', {
			color: 0xffffff
		}, planet);
	});

	sceneGL.add(planet);
}