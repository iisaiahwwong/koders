$(function () {
    init();
})

/* ---------------------------------------------------
    SOCKET
----------------------------------------------------- */


function initSocket(callback) {
    let interval;

    let socket = io();

    socket.emit('location get');

    socket.emit('location stream');

    socket.on('location get', function (data) {

        let index = 0;

        let array = JSON.parse(data);

        if (!(array.length < 0)) {

            interval = setInterval(function () {

                if (index == array.length) {

                    clearInterval(interval);

                    socket.emit('location stream');

                    return;
                }

                populate(array[index]);

                index++;

            }, 0.01);
        }
        else {
            socket.emit('location stream');
        }
    });

    socket.on('location stream', function (data) {
        populate(JSON.parse(data));

    });

    function populate(data) {

        let location = new Location();

        location.construct(data);

        callback(location);

        return;

    }

}

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

const PARTICLE_SIZE = 50;

function init() {
    /** Camera */
    // Initialize THREEjs Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 3500;
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

    // document.addEventListener('mousemove', onDocumentMouseMove, false);
    // document.addEventListener('touchstart', onDocumentTouchStart, false);
    // document.addEventListener('mousedown', onDocumentMouseDown, false);

    /** Listeners */
    btnSuiteOnClick();

    /** Camera Controls */
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.5;
    controls.maxDistance = 6000;

    // controls = new THREE.OrbitControls(camera);
    // controls.rotateSpeed = 0.5;
    // controls.minDistance = 500;

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

    // Start sentiment visualisation
    // initSentimentVisual();
    initVisualMap();
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

    if (sceneCss.children.length > 0) {
        let cssObjects = sceneCss.children;

        for (let i = 0; i < cssObjects.length; i++) {

            cssObject = cssObjects[i];

            if (cssObject instanceof THREE.CSS3DObject) {
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

function Location() {

    this._id;
    this.id;
    this.location;

}

Location.prototype.construct = function (location) {

    for (let key in location) {

        this[key] = location[key];

    }

}

function intialiseParticleBuffer(size, spacing, particleSize) {

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
        vertex.y = spacing * Math.sin(theta) * Math.sin(phi);
        vertex.z = spacing * Math.cos(theta);

        vertex.toArray(positions, i * 3);
        color.set(0x0B141B);

        color.toArray(colors, i * 3);
        sizes[i] = particleSize;
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
            texture: { value: new THREE.TextureLoader().load("/textures/sprites/circle.png") }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        alphaTest: 0.9,
        transparent: true,
    });

    let locationParticles = new THREE.Points(geometry, material);
    locationParticles.userData = userData;

    sceneGL.add(locationParticles);

    locationParticles.updateMatrixWorld();

    return locationParticles;

}


function changeOpacity(material, opacity) {

    new TWEEN.Tween(material)
        .to({ opacity: opacity }, 1000)
        .easing(TWEEN.Easing.Exponential.In)
        .start();

    return;

}

/* ---------------------------------------------------
	LAYOUT
----------------------------------------------------- */

function spaceOut(space) {

    let geometry = locationParticles.geometry;
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


function loopOpacity(arr, opacity) {

    let geometry = locationParticles.particles.geometry;
    let attributes = geometry.attributes;
    let index;

    for(let i = 0; i < arr.length; i++) {
       
        index = arr[i];

        attributes.opacity.array[index] = opacity;
        attributes.opacity.needsUpdate = true;

    }

}

var line;

function connectNodes(cluster_index) {

    let arr = [];

    let geometry = particles.geometry;
    let attributes = geometry.attributes;
    let index, x, y, z;

    for(let i = 0; i < cluster_index.length; i++ ) {
        
        index = cluster_index[i] * 3;

        x = attributes.position.array[index]
        y = attributes.position.array[index + 1];
        z = attributes.position.array[index + 2];

        arr.push(new THREE.Vector3(x, y, z));

    }

    removeTHREEObject(line);

    line = VISUAL.connectNodesLines(arr, 0xe5e5e5, 0.3);
	VISUAL.animateLine(line, line.points.length, 1);
} 

/* ---------------------------------------------------
	INTERACTION LISTENER
----------------------------------------------------- */

function btnSuiteOnClick() {

    $('.positive-btn').on('tap click',function () {
        cluster('positive');
    });

    $('.neutral-btn').click(function () {
        cluster('neutral');
    });

    $('.negative-btn').click(function () {
        cluster('negative');
    });

     $('.all-btn').click(function () {
        cluster('all');
    });

}

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

    particles.updateMatrixWorld();

    let intersects = raycaster.intersectObject(particles, true);

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

    particles.updateMatrixWorld();

    var intersects = raycaster.intersectObject(particles, true);

    if (intersects.length > 0) {

        removeCSSObject(tempLabel);

        INTERSECTED = intersects[0].index;
        tempLabel = particles.userData[INTERSECTED].cssLabel;
        sceneCss.add(tempLabel);

        let tweet = particles.userData[INTERSECTED];
        genTweet(tweet);
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

/* ---------------------------------------------------
	INTERPOLATION 
----------------------------------------------------- */

/* ---------------------------------------------------
	MAP  
----------------------------------------------------- */


let locationParticles;
let obj;
let circles;

function initVisualMap() {

    drawBorder();

    locationParticles = intialiseParticleBuffer(10000, 500, 50);

    initSocket(pushParticles);

    initChart();
    
    // reorderParticles();

    // seedPeopleData(100);

    density();

}

function initChart() {
    let bar = drawRectangle(50, 25, 100, 0xffffff, -2000, 0, 10);
    let bar1 = drawRectangle(50, 25, 100, 0xffffff, -2000, 0, 10);
    let bar2 = drawRectangle(50, 25, 100, 0xffffff, -2000, 0, 10);

    // sceneGL.add(bar);
}

function drawRectangle(width, height, depth, color, pX, pY, pZ) {

	var boxGeometry = new THREE.BoxGeometry(width, height, depth);
	var material = new THREE.MeshBasicMaterial({color: color});
	
	var bar = new THREE.Mesh(boxGeometry, material);
	
	bar.position.x = pX;
	bar.position.y = pY;
	bar.position.z = pZ;
	
    return bar;
    
}

function expand() {
    let index, radius, angle;   
    let geometry = locationParticles.geometry;
    let attributes = geometry.attributes;

    for(let i = 0; i < 200; i++) {
        
        attributes.size.array[getRandomInt(0, 200-1)] = 80;

        attributes.position.needsUpdate = true;
    }
}

function reorderParticles() {

    let index, radius, angle;   
    let geometry = locationParticles.geometry;
    let attributes = geometry.attributes;

    for(let i = 0; i < 5000; i++) {

        index = i * 3;

        radius = getRandomInt(0, 1000);
        angle = getRandomInt(0, 360);
        
        attributes.position.array[index] = 100 + (radius * Math.cos(toRadians(angle))); // X
        attributes.position.array[index + 1] = -100 + (radius * Math.sin(toRadians(angle))); // y
        attributes.position.array[index + 2] = 50;

        attributes.opacity.array[index] = 1;

        attributes.opacity.needsUpdate = true;
        attributes.position.needsUpdate = true;
        

    }

}

function drawBorder() {
    
    circles = new VISUAL.Circle().drawThickCircle({
        startPosition: new THREE.Vector3(100, -100, 0),
        color: 0x05FFD2,
        resolution: 361,
        startAngle: 0,
        radius: 1200,
    }, 10, 0.5);

    

    VISUAL.animateThickLine(circles, 2);

}

function seedPeopleData(total) {

    let index = 0;

    let interval = setInterval(function () {
        index++;

        if (index == total) clearInterval(interval);

        let location = new Location();

        pushParticles(location);

    }, 1);

}

/* ---------------------------------------------------
    DATA STREAM
----------------------------------------------------- */

function pushParticles(location) {

    if (!(location instanceof Location)) return;

    let userData = locationParticles.userData;

    let color = new THREE.Color();

    for (let key in userData) {

        if (userData[key] instanceof Location) continue;

        userData[key] = location;

        let geometry = locationParticles.geometry;
        let attributes = geometry.attributes;

        let index = key * 3;

        color.set(0x17BCDE);
        
        attributes.customColor.array[index] = color.r;
        attributes.customColor.array[index + 1] = color.g;
        attributes.customColor.array[index + 2] = color.b;
        attributes.customColor.needsUpdate = true;

        try {

            console.log('CoordX: ' + location.location.coordinates[0] + ' CoordY: ' + location.location.coordinates[1]);

            let coodX = location.location.coordinates[0];
            let coodY = location.location.coordinates[1];

            let radius = Math.sqrt(Math.pow(coodX, 2) + Math.pow(coodY, 2));

            console.log(radius);

            // let angle = toDegrees(Math.atan(coodY/coodX));

            // let inverseAngle = (angle + 180) % 360;

            attributes.position.array[index] = coodX + 100;
            attributes.position.array[index + 1] = coodY - 200;
            attributes.position.array[index + 2] = 50;     
            attributes.position.needsUpdate = true;

        }
        catch(err) {
            console.log(location);
        }
        
        attributes.opacity.array[key] = 1;

        attributes.opacity.needsUpdate = true;
        
        break;

    }
}

function density() {
    
    setInterval(function() {

        let distance = getDistance(camera, new THREE.Vector3(0, 0,0));

        let geometry = locationParticles.geometry;
        let attributes = geometry.attributes;

        let index;

        for(let i = 0; i < 2000; i++) {
            
            attributes.size.array[i] = 0.1 * distance;

            attributes.size.needsUpdate = true;
        }

        let s = Math.pow(distance, -1) * 3000;

        for(let i = 0; i < circles.length; i++) {

            if(s < 1)
                break;
            if(s > 1.2) s = 1.1;

            circles[i].scale.set(s,s,s);

        }

    }, 0); 

}

function getDistance(mesh1, mesh2) {  
  var dx = mesh1.position.x - mesh2.x; 
  var dy = mesh1.position.y - mesh2.y; 
  var dz = mesh1.position.z - mesh2.z; 

  return Math.sqrt(dx*dx+dy*dy+dz*dz); 
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}