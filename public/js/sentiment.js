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

const PARTICLE_SIZE = 100;


function init() {
    /** Camera */
    // Initialize THREEjs Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 10000);
    camera.position.z = 600;
    camera.position.y = 0;

    /** Get ID of div */
    graphicContainer = document.getElementById('graphic-container');

    /** Renderers */
    // GL Renderer
    rendererGL = new THREE.WebGLRenderer();
    rendererGL.setSize(window.innerWidth, window.innerHeight);
    rendererGL.setClearColor(BLACK_THEME, 1);
    rendererGL.domElement.style.zIndex = 5;
    rendererGL.setPixelRatio(window.devicePixelRatio);

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

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    /** Camera Controls */
    //    controls = new THREE.TrackballControls(camera);

    controls = new THREE.OrbitControls(camera);
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
    
    lookToCameraCSS();
}

function lookToCameraCSS() {

      if(sceneCss.children.length > 0) {
        let cssObjects = sceneCss.children;

        for(let i = 0; i < cssObjects.length; i++) {

            cssObject = cssObjects[i];

            if(cssObject instanceof THREE.CSS3DObject) {
                cssObject.lookAt(camera.position);
            }
            
        }

    }

}

function toRadians(angle) {
    return angle * Math.PI / 180;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * TEMPLATE FOR SENTIMENT ANALYSIS
 * 
 * DRAW THREE SPACES
 */

/* ---------------------------------------------------
    MODELS
----------------------------------------------------- */

let emotions = [
    'POSITIVE', 'NEGATIVE', 'NEUTRAL'
]

let handle = [
    'iisaiahwwong', 'alex00i', 'Jasondoe'
]

function Tweet() {
    
    this.tweet_id;
    this.create_timestamp;
    this.twitter_name;
    this.twitter_handle;
    this.tweet;
    this.sentiment;
    this.sentiment_value;
    this.cssLabel

}

/* ---------------------------------------------------
    LAYOUTS
----------------------------------------------------- */

function initSentimentVisual() {

    intialiseParticleBuffer(100, 300);

    let index = 0;

    let interval = setInterval(function() {
        
        if(index == 100) clearInterval(interval);

        let tweet = new Tweet();
        tweet.tweet = index+' tweet'
        tweet.twitter_handle = handle[getRandomInt(0, 2)];
        tweet.sentiment = emotions[getRandomInt(0, 2)];
    
        pushData(tweet);

        index++;

    }, 1000)


    // setTimeout(function() {
    //     spaceOut(10);
    // }, 2000);
}

var particles;

function intialiseParticleBuffer(size, spacing) {
    
    let particleCount = size;

    let positions = new Float32Array(particleCount * 3);
    let colors = new Float32Array(particleCount * 3);
    let sizes = new Float32Array(particleCount);
    var opacities = new Float32Array(particleCount);

    let color = new THREE.Color();

    let userData = {};

    let geometry = new THREE.BufferGeometry();
    let material;

    spacing = spacing || 20;

    for (let i = 0; i < particleCount; i++) {

        let vertex = new THREE.Vector3();
        let theta = THREE.Math.randFloatSpread(360);
        let phi = THREE.Math.randFloatSpread(360);

        vertex.x = spacing * Math.sin(theta) * Math.cos(phi);
        vertex.y = spacing * 1.1 * Math.sin(theta) * Math.sin(phi);
        vertex.z = spacing * Math.cos(theta);

        vertex.toArray(positions, i * 3);
        color.set(0x0B141B);

        color.toArray(colors, i * 3);
        sizes[i] = PARTICLE_SIZE;
        userData[i] = '';

        opacities[i] = 0;

    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.addAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            texture: { value: new THREE.TextureLoader().load("/textures/sprites/node 12.11.18 PM.png") }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        alphaTest: 0.9,
        transparent: true,
    });

    particles = new THREE.Points(geometry, material);
    particles.userData = userData;

    sceneGL.add(particles);

}

function spaceOut(space) {
    let geometry = particles.geometry;
    let attributes = geometry.attributes;
    let index;

    for (let i = 0; i < attributes.position.array.length; i++) {

        index = i * 3;

        attributes.position.array[index] *= space;
        attributes.position.array[index + 1] *= space;
        attributes.position.array[index + 2] *= space;
        attributes.position.needsUpdate = true;
        
    }
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

function pushData(tweet) {

    if(!(tweet instanceof Tweet)) return;

    let userData = particles.userData;

    let color = new THREE.Color();
   
    for(let key in userData) {
        
        if(userData[key] instanceof Tweet) continue;
        userData[key] = tweet;

        let geometry = particles.geometry;
        let attributes = geometry.attributes;

        let index = key * 3;

        let colorHex = processSentiment(tweet);

        color.set(colorHex);

        let x = attributes.position.array[index];
        let y = attributes.position.array[index + 1];
        let z = attributes.position.array[index + 2];

        let cssLabel = addLabel(new THREE.Vector3(x, y, z), tweet, 'tweet', 60);
        tweet.cssLabel = cssLabel

        attributes.customColor.array[index] = color.r;
        attributes.customColor.array[index + 1] = color.g;
        attributes.customColor.array[index + 2] = color.b;
        attributes.customColor.needsUpdate = true;

        attributes.opacity.array[key] = 1;
        attributes.opacity.needsUpdate = true;

        break;

    }
}

function processSentiment(tweet) {

    if(! (tweet instanceof Tweet)) return;
    
    sentiment = tweet.sentiment.toUpperCase();

    switch(sentiment) {
        case 'NEGATIVE':
            return 0xff0000;
        case 'NEUTRAL':
            return 0xDAF8FA;
        case 'POSITIVE':
            return 0x0ff7ed;
        default:
            return 0xDAF8FA;
    }
}

function addLabel(bindObject, tweet, cssClass, offset) {
    
    let startObject = (bindObject instanceof THREE.Object3D) ? bindObject.position : bindObject;
	
	var label = document.createElement('div');
	label.className = cssClass;
	label.innerHTML = tweet.tweet;
	
	var object = new THREE.CSS3DObject(label);
	object.position.x = startObject.x + offset;
	object.position.y = startObject.y;
	object.position.z = startObject.z;
	
	return object;
    
}


/* ---------------------------------------------------
	INTERACTION LISTENER
----------------------------------------------------- */

function onDocumentTouchStart(event) {
    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseMove(event);

}

var INTERSECTED;

function onDocumentMouseMove(event) {

    setUpRaycaster(event);

    let geometry = particles.geometry;
    let attributes = geometry.attributes;

    let intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].index) {

            INTERSECTED = intersects[0].index;

            attributes.size.array[INTERSECTED] = PARTICLE_SIZE * 2.25;
            attributes.size.needsUpdate = true;

        }
    }
    else { // No interaction

        attributes.size.array[INTERSECTED] = PARTICLE_SIZE;
        attributes.size.needsUpdate = true;

        INTERSECTED = null;

    }
}

let tempLabel;

function onDocumentMouseDown(event) {

    setUpRaycaster(event);

    var intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {

        removeCSSObject(tempLabel);

        INTERSECTED = intersects[0].index;
        tempLabel = particles.userData[INTERSECTED].cssLabel;
        sceneCss.add(tempLabel);

        console.log(particles.userData[INTERSECTED]);
    }
    else { // No interaction

        INTERSECTED = null;

    }
}

function setUpRaycaster(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // console.log('X | ' + mouse.x);
    // console.log('Y | ' + mouse.y);

    raycaster.setFromCamera(mouse, camera);
}

function removeCSSObject(label) {
    if(!label) return;

    if(typeof label.length !== 'undefined') 
        if(label.length > 0) return;

    sceneCss.remove(sceneCss.getObjectById(label.id));
}