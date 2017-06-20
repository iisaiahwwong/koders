$(function() {
    init();
}) 
/**
 * THREE JS SETUP
 * Using CSS Renderer and WebGL Renderer
 */

var camera, sceneGL, sceneCss, rendererGL, rendererCss, controls, stats, composer;

var mouse, raycaster;

var graphicContainer;

var audio;

const CIRCLE_SEGMENT = 80;

const DANGER = -1, NEW = 1, ACTIVITY = 2;

function init() {
	/** Camera */
	// Initialize THREEjs Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
	camera.position.z = 3500;
	camera.position.y = 0;
	
	/** Get ID of div */
	graphicContainer = document.getElementById('graphic-container');
	
	/** Renderers */
	// GL Renderer
	rendererGL = new THREE.WebGLRenderer({ antialias: true });
	rendererGL.setSize(window.innerWidth, window.innerHeight);
	rendererGL.setClearColor( 0xE6EAEB, 1);
	rendererGL.domElement.style.zIndex = 5;
	graphicContainer.appendChild(rendererGL.domElement);
	
	// CSS3D Renderer
	rendererCss = new THREE.CSS3DRenderer();
	rendererCss.setSize(window.innerWidth, window.innerHeight);
	rendererCss.domElement.style.position = 'absolute';
	rendererCss.domElement.style.top = '100px';
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
	controls = new THREE.OrbitControls(camera);
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	
	/** Start Graphics */
	// composer = compose();
	initVisual();

	
	/** Initialize Stats */
	stats = new Stats();
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	
	// Align top-right
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0';
	stats.domElement.className = 'stats';
	// graphicContainer.appendChild(stats.domElement);
	
	// Resize renderers when page is changed
	window.addEventListener( 'resize', onWindowResize, false );
    animate();
}

/**
 * Renders all renderers
 */
function render() {
	rendererCss.render(sceneCss, camera);
	rendererGL.render(sceneGL, camera);
	// composer.render();
}

/**
 * Change the page aspect ratio and size based on user's browser
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	rendererGL.setSize( window.innerWidth, window.innerHeight );
	rendererCss.setSize( window.innerWidth, window.innerHeight );
	
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
	drawCircleBorder(155, 60, -500, 200, 0, '', 0x35817D, 0.8, 15, 45);
	drawCircleBorder(145, 70, -500, 200, 0, '', 0x35817D, 0.5, 15, 80);
	drawCircleBorder(155, 120, -500, 200, 0, '', 0x35817D, 0.8, 15, 120);
	drawCircleBorder(145, 60, -500, 200, 0, '', 0x35817D, 0.5, 15, 170);
	drawCircleBorder(145, 100, -500, 200, 0, '', 0x35817D, 0.8, 15, 235);
	drawCircleBorder(155, 38, -500, 200, 0, '', 0x35817D, 0.5, 15, 325);
	drawCircleBorder(145, 40, -500, 200, 0, '', 0x35817D, 0.8, 15, 5);

	drawThickCircle(380, 361, -500, 200, 0, 8, 0x35817D, 1, 'process')
}

function toRadians(angle) {
	return angle * Math.PI/180;
}