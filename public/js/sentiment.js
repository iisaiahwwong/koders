$(function () {
    init();
})

/* ---------------------------------------------------
    SOCKET
----------------------------------------------------- */

let tracker = {};

function initSocket(callback) {
    let interval;

    let socket = io();

    socket.emit('get');

    socket.on('get', function (data) {

        let index = 0;

        let array = JSON.parse(data);

        if (!(array.length < 0)) {

            interval = setInterval(function () {

                if (index == array.length) {

                    clearInterval(interval);

                    socket.emit('stream');
                    sortHashtags();

                    return;
                }

                populate(array[index]);

                index++;

            }, 0.001);
        }
    });

    socket.on('stream', function (data) {
        let id =JSON.parse(data)._id;
        console.log(data);
        if(!(id in tracker)) {
            tracker[id] = ' ';
            populate(JSON.parse(data));
        }


    });

    function populate(data) {

        let tweet = new Tweet();

        tweet.construct(data);

        callback(tweet);

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
    camera.position.z = 2000;
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

let emotions = [
    'POSITIVE', 'NEGATIVE', 'NEUTRAL'
]

let handle = [
    'iisaiahwwong', 'alex00i', 'Jasondoe'
]

function Tweet() {

    this._id;
    this.create_timestamp;
    this.twitter_name;
    this.twitter_handle;
    this.tweet;
    this.sentiment;
    this.sentiment_value;
    this.hashtag;
    this.cssLabel
    this.cssTwitterHandle;

}

Tweet.prototype.construct = function (tweet) {

    for (let key in tweet) {

        this[key] = tweet[key];

    }

}

/* ---------------------------------------------------
    SENTIMENT
----------------------------------------------------- */

function initSentimentVisual() {

    particles = intialiseParticleBuffer(5000, 500, 50);
    //    seedData();
    initSocket(pushData);

}

function seedData() {

    let index = 0;

    let interval = setInterval(function () {
        index++;

        if (index == 200) clearInterval(interval);

        let tweet = new Tweet();
        tweet.tweet = index + ' Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
        tweet.twitter_handle = handle[getRandomInt(0, 2)];
        tweet.sentiment = emotions[getRandomInt(0, 2)];
        tweet.sentiment_value = getRandomInt(1, 10);

        pushData(tweet);


    }, 50);
}

var particles;

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

    let particles = new THREE.Points(geometry, material);
    particles.userData = userData;

    sceneGL.add(particles);

    particles.updateMatrixWorld();

    return particles;

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

var positive_index = [];
var negative_index = [];
var neutral_index = [];

var topPositiveTweets = [],
    topNegativeTweets = [];

var topHashTags = [];

var filter;

function pushData(tweet) {

    if (!(tweet instanceof Tweet)) return;

    let userData = particles.userData;

    let color = new THREE.Color();

    for (let key in userData) {

        if (userData[key] instanceof Tweet) continue;

        userData[key] = tweet;

        let geometry = particles.geometry;
        let attributes = geometry.attributes;

        let index = key * 3;

        let colorHex = processSentiment(tweet, key);
        processHashtags(tweet, key);

        color.set(colorHex);

        attributes.customColor.array[index] = color.r;
        attributes.customColor.array[index + 1] = color.g;
        attributes.customColor.array[index + 2] = color.b;
        attributes.customColor.needsUpdate = true;

        let x = attributes.position.array[index];
        let y = attributes.position.array[index + 1];
        let z = attributes.position.array[index + 2];

        let twitterHandleLabel = addLabel(new THREE.Vector3(x, y, z), tweet.twitter_handle, 'twitter-handle-3d', -45);
        tweet.cssTwitterHandle = twitterHandleLabel;
        //        sceneCss.add(twitterHandleLabel);

        let cssLabel = addTweetLabel(new THREE.Vector3(x, y, z), tweet, 'tweet-3d', 0);
        tweet.cssLabel = cssLabel;

        if (!filter && !fake)
            attributes.opacity.array[key] = 1;
        if (!filter)
            attributes.opacity.array[key] = 1;
        else if (filter.toLowerCase() === tweet.sentiment.toLowerCase())
            attributes.opacity.array[key] = 1;


        attributes.opacity.needsUpdate = true;

        // Increment the counter
        increment();

        // Updates the ratio emotion of tweets 
        ratio();
        break;

    }
}

function ratio() {

    let $bar_positive = $('.bar-positive');
    let $bar_negative = $('.bar-negative');
    let $bar_neutral = $('.bar-neutral');

    let negative_length = negative_index.length;
    let positive_length = positive_index.length;
    let neutral_length = neutral_index.length;

    let total = negative_length + positive_length + neutral_length;

    $bar_positive.css('width', (positive_length / total * 100) + '%');
    $bar_neutral.css('width', (neutral_length / total * 100) + '%');
    $bar_negative.css('width', (negative_length / total * 100) + '%');

    $bar_positive.text(positive_length);
    $bar_neutral.text(neutral_length);
    $bar_negative.text(negative_length);

}

function processSentiment(tweet, key) {

    if (!(tweet instanceof Tweet)) return;

    sentiment = tweet.sentiment.toUpperCase();

    switch (sentiment) {
        case 'NEGATIVE':
            negative_index.push({ key: key, tweet: tweet });
            getTopSentimentValues(topNegativeTweets, tweet, key);
            return 0xff0000;
        case 'NEUTRAL':
            neutral_index.push({ key: key, tweet: tweet });
            return 0x56CCF2;
        case 'POSITIVE':
            positive_index.push({ key: key, tweet: tweet });
            getTopSentimentValues(topPositiveTweets, tweet, key);

            return 0x20e3b2;
        default:
            return 0x20e3b2;
    }

}

function processHashtags(tweet) {

    let hashtag = tweet.hashtag;

    if (!topHashTags.length)
        topHashTags.push({
            hashtag: hashtag,
            counter: 1
        });

    for (let i = 0; i < topHashTags.length; i++) {

        let current = topHashTags[i].hashtag.toLowerCase();

        if (current === hashtag.toLowerCase()) {
            topHashTags[i].counter += 1;
            break;
        }

        if (i === topHashTags.length - 1)
            topHashTags.push({
                hashtag: hashtag,
                counter: 1
            });

    }

}

function sortHashtags() {

    topHashTags.sort(function (a, b) {
        if (b.counter < a.counter)
            return -1;
        if (b.counter > a.counter)
            return 1;
        return 0;
    });
    // populate table
    genHashtag();
}

function getTopSentimentValues(array, tweet, key) {

    if (array.length) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].tweet.tweet_id === tweet.tweet_id) {
                return;
            }
        }
    }

    if (array.length !== 5) {

        array.push({ key: key, tweet: tweet });
        return;

    }

    // Sorts by sentiment value
    array.sort(function (a, b) {

        if (b.tweet.sentiment_value == a.tweet.sentiment_value)
            return new Date(a.tweet.create_timestamp) - new Date(b.tweet.create_timestamp);
        else
            return a.tweet.sentiment_value - b.tweet.sentiment_value;

    });

    if (tweet.sentiment_value > array[0].tweet.sentiment_value) {

        if (tweet.sentiment_value == array[0].tweet.sentiment_value) {

            if (new Date(tweet.create_timestamp) - new Date(array[0].tweet.create_timestamp) > 0) {

                array[0].key = key;
                array[0].tweet = tweet;

                return;
            }

            return;

        }

        array[0].key = key;
        array[0].tweet = tweet;

        return;

    }

}


function searchHashTag(search) {

    let allTweets = positive_index.concat(neutral_index, negative_index);

    let tweet;

    let filtered = [];

    for (let i = 0; i < allTweets.length; i++) {

        tweet = allTweets[i].tweet.tweet;

        if (new RegExp(search + " ").test(tweet))
            filtered.push(allTweets[i]);

    }

    if (filtered.length > 1) {
        // animate searchterm
        loopOpacity(allTweets, 0);
        loopOpacity(filtered, 1);
        connectNodes(filtered);

        return true;
    }

    return false;

}

function searchPython(search, event) {
    if (event.keyCode == 13) {
        console.log('ENTER');
        $.ajax({
            type: 'get',
            url: 'http://192.168.8.104:8081?tweet_request=' + search,
            success: function (res) {
                console.log(res);
            }
        })
    }

}


function addLabel(bindObject, text, cssClass, offset) {

    let startObject = (bindObject instanceof THREE.Object3D) ? bindObject.position : bindObject;

    var label = document.createElement('div');
    label.className = cssClass;
    label.innerHTML = text.sentiment;

    var object = new THREE.CSS3DObject(label);
    object.position.x = startObject.x + offset;
    object.position.y = startObject.y;
    object.position.z = startObject.z;

    return object;

}

function addTweetLabel(bindObject, tweet, cssClass, offset) {

    if (!(tweet instanceof Tweet)) console.warn('Not an instance of Tweet');

    let startObject = (bindObject instanceof THREE.Object3D) ? bindObject.position : bindObject;

    let label = document.createElement('div');
    label.className = cssClass;

    let twitter_handle = document.createElement('p');
    twitter_handle.className = 'handle-3d';

    let tweet_desc = document.createElement('p');
    tweet_desc.className = 'tweet-desc-3d';

    twitter_handle.innerHTML = '@' + tweet.twitter_handle;
    tweet_desc.innerHTML = tweet.tweet;

    label.appendChild(twitter_handle);
    label.appendChild(tweet_desc);

    let object = new THREE.CSS3DObject(label);
    object.position.x = startObject.x + offset;
    object.position.y = startObject.y;
    object.position.z = startObject.z;

    return object;

}

/* ---------------------------------------------------
	LAYOUT
----------------------------------------------------- */

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

function cluster(type) {

    let invisible;
    let visible;

    filter = type;

    switch (type) {
        case 'positive':
            invisible = negative_index.concat(neutral_index);
            visible = positive_index;
            break;
        case 'negative':
            invisible = positive_index.concat(neutral_index);
            visible = negative_index;
            break;
        case 'neutral':
            invisible = negative_index.concat(positive_index);
            visible = neutral_index;
            break;
        default:
            invisible = null;
            filter = null;
            removeTHREEObject(line);
            loopOpacity(positive_index.concat(neutral_index, negative_index), 1);
    }

    if (!invisible) return;

    loopOpacity(visible, 1);

    // hide non filtered objects
    loopOpacity(invisible, 0);
    connectNodes(visible);
}

let fake;

function fakeData() {

    let geometry = particles.geometry;
    let attributes = geometry.attributes;

    let arr = positive_index.concat(neutral_index, negative_index);
    let line = [];

    loopOpacity(arr, 0);

    for (let i = 0; i < 50; i++) {
        attributes.opacity.array[i] = 1;
        line.push(i);
    }

    connectNodes(line);

}

function loopOpacity(arr, opacity) {

    let geometry = particles.geometry;
    let attributes = geometry.attributes;
    let index;

    for (let i = 0; i < arr.length; i++) {

        index = arr[i].key;

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

    for (let i = 0; i < cluster_index.length; i++) {

        index = cluster_index[i].key * 3;

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
let isFound;

function btnSuiteOnClick() {

    $('.positive-btn').on('tap click', function () {
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

    $('.black-btn').click(function () {
        $.ajax({
            type: 'get',
            url: '/tweet/delete/all',
            success: function (res) {
                if (res.success) clearAll();
            }
        });
    });

    $('.search').keyup(function (event) {
        let search = $(this).val();

        if (search.length < 3) return;

        if (searchHashTag(search)) {
            fake = true;
            isFound = false;
        }
        else {
            cluster('all');
            fake = false;
        }

        if (!isFound) {
            searchPython(search, event);
        }
    });

    function clearAll() {

        particles.userData = {};

        let geometry = particles.geometry;
        let attributes = geometry.attributes;
        tweet_count = 0;
        $('#tweet-counter').text(tweet_count);

        positive_index = [];
        negative_index = [];
        negative_index = [];
        topPositiveTweets = [],
        topNegativeTweets = [];
        topHashTags = [];

        let $bar_positive = $('.bar-positive');
        let $bar_negative = $('.bar-negative');
        let $bar_neutral = $('.bar-neutral');

        $bar_positive.css('width','0%');
        $bar_neutral.css('width', '0%');
        $bar_negative.css('width', '0%');


        for (let i = 0; i < attributes.opacity.array.length; i++) {
            attributes.opacity.array[i] = 0;
            attributes.opacity.needsUpdate = true;
        }

    }

    $('.data-body').on('click', '.list', function () {
        let hashtag = $('.data-hashtag', this).text();
        $(".list").removeClass("active");

        $(this).addClass("active");

        cluster('all');
        searchHashTag(hashtag);
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
let tweet_count = 0;

function increment() {
    ++tweet_count;
    $('#tweet-counter').text(tweet_count);

    // if(tweet_count % 50 === 0 && tweet_count < 500) spaceOut(1.4);
}

function genTweet(tweet) {
    if (!(tweet instanceof Tweet)) {
        $('.info-overview .user-msg').show();
        return;
    }

    // Remove message box
    if ($('.info-overview .user-msg').length > 0) $('.info-overview .user-msg').hide();

    let $tweet = $('.tweet');
    let $sentiment = $('.sentiment');
    let $value = $('.sentiment-value');
    let $emotion = $('.emotion');

    let emotionBar = getSentimentGradient(tweet.sentiment);
    let emotionText = getSentimentText(tweet.sentiment);

    $emotion.css('width', (tweet.sentiment_value * 10) + '%');

    $tweet.text(tweet.tweet);
    $sentiment.text(tweet.sentiment);
    $emotion.text(tweet.sentiment_value + '0%');
    $emotion.attr('class', 'emotion  progress-bar ' + emotionBar);
    $sentiment.attr('class', 'sentiment ' + emotionText);
    // $value.attr('class', 'sentiment-value ' + emotionText);
}

function getSentimentGradient(sentiment) {

    sentiment = sentiment.toUpperCase();

    switch (sentiment) {
        case 'NEGATIVE':
            return 'negative';
        case 'NEUTRAL':
            return 'neutral';
        case 'POSITIVE':
            return 'positive';
        default:
            return 'positive';
    }

}

function genHashtag() {
    let filtered = topHashTags.slice(0, 5);

    let $databody = $('.data-body');

    if ($databody.children().length === 5) $databody.empty();

    for (let i = 0; i < filtered.length; i++) {
        let list = $('<div>', { class: 'list' });
        let rank = $('<span>', { class: 'rank' });
        let hashtag = $('<span>', { class: 'data-hashtag' });

        let obj = filtered[i];

        rank.text(obj.counter);
        hashtag.text(obj.hashtag);

        list.append(rank).append(hashtag);

        $databody.append(list);
    }

}

function getSentimentText(sentiment) {
    sentiment = sentiment.toUpperCase();

    switch (sentiment) {
        case 'NEGATIVE':
            return 'negative-text';
        case 'NEUTRAL':
            return 'neutral-text';
        case 'POSITIVE':
            return 'positive-text';
        default:
            return 'positive-text';
    }
}

function removeTHREEObject(obj) {

    if (!obj) return;

    if (typeof obj.length !== 'undefined')
        if (obj.length > 0) return;

    sceneGL.remove(sceneGL.getObjectById(obj.id));

}

function removeCSSObject(label) {

    if (!label) return;

    if (typeof label.length !== 'undefined')
        if (label.length > 0) return;

    sceneCss.remove(sceneCss.getObjectById(label.id));

}

/* ---------------------------------------------------
	CSS  
----------------------------------------------------- */
