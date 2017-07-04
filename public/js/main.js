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
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 10000);
	camera.position.z = 3500;
	camera.position.y = 0;

	/** Get ID of div */
	graphicContainer = document.getElementById('graphic-container');

	/** Renderers */
	// GL Renderer
	rendererGL = new THREE.WebGLRenderer({ antialias: true });
	rendererGL.setSize(window.innerWidth, window.innerHeight);
	rendererGL.setClearColor(WHITE_THEME, 1);
	rendererGL.domElement.style.zIndex = 5;
	graphicContainer.appendChild(rendererGL.domElement);

	// CSS3D Renderer
	rendererCss = new THREE.CSS3DRenderer();
	rendererCss.setSize(window.innerWidth, window.innerHeight);
	rendererCss.domElement.style.position = 'absolute';
	rendererCss.domElement.style.top = '0px';
	rendererCss.domElement.className = 'cssRenderer';
	graphicContainer.appendChild(rendererCss.domElement);

	/** Scenes */
	// GL Scene
	sceneGL = new THREE.Scene();

	// CSS3D Scene
	sceneCss = new THREE.Scene();

	/** Click Controls */
	mouse = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	// document.addEventListener( 'mousedown', onDocumentMouseDown, false );

	/** Camera Controls */
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;	// controls = new THREE.OrbitControls(camera);
	// controls.rotateSpeed = 0.5;
	// controls.minDistance = 500;
	// controls.maxDistance = 6000;

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

	initSentimentVisual();
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
	var circle = new VISUAL.BorderCircle().drawBorderCircle({
		startPosition: new THREE.Vector3(0, 0, 0),
		color: 0x1A5E75,
		resolution: 361,
		startAngle: 0,
		radius: 200
	});

	VISUAL.animateLine(circle, circle.points.length, 2);

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

let POSITIVE_AREA, NEGATIVE_AREA, NEUTRAL_AREA;

function defineArea() {
	
	POSITIVE_AREA = new VISUAL.Sphere().drawSphere({
		startPosition: new THREE.Vector3(-1000, 0, 0),
		color: 0x015F6F,
		opacity: 0.5,
		radius: 300
	});

	NEGATIVE_AREA = new VISUAL.Sphere().drawSphere({
		startPosition: new THREE.Vector3(0, 0, 0),
		color: 0xF54907,
		opacity: 0.5,
		radius: 300
	});

	NEUTRAL_AREA = new VISUAL.Sphere().drawSphere({
		startPosition: new THREE.Vector3(1000, 0, 0),
		color: 0x191D42,
		opacity: 0.5,
		radius: 300
	});

	POSITIVE_AREA.scale.set(0,0,0);
	NEGATIVE_AREA.scale.set(0,0,0);
	NEUTRAL_AREA.scale.set(0,0,0);

	sceneGL.add(POSITIVE_AREA);
	sceneGL.add(NEGATIVE_AREA);
	sceneGL.add(NEUTRAL_AREA);
}

function drawNodes() {
	let node = new VISUAL.Sphere().drawSphere({
		startPosition: new THREE.Vector3(0, 0, 0),
		color: 0xffffff,
		opacity: 0.5,
		radius: 100
	});
}

function grow(node, size) {
	new TWEEN.Tween(node.scale)
		.to({x: size, y: size, z: size}, 2000)
		.easing(TWEEN.Easing.Exponential.In)
		.start();
}