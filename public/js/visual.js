/* ---------------------------------------------------
    DRAW METHODS
----------------------------------------------------- */

var VISUAL = (function () {
    "use strict";

    function Visual() {
        this.setValues = (values) => {
            if (values === undefined) return;

            for (let key in values) {
                this[key] = values[key];
            }
        }
    }


    CubicBezier.prototype = new Visual();

    function CubicBezier() {
        this.startObject;
        this.endObject;
        this.color;
    }

	/**
	 * @author iisaiah
	 * @param {CubicOptions} cubicOptions 
	 * 
	 * Parameters for CubicOptions
	 * @param {THREE.Object3D || THREE.Vector3} startObject
	 * @param {THREE.Object3D || THREE.Vector3} endObject
	 * @param {HEX} color 
	 */
    CubicBezier.prototype.drawCubicBezier = function (cubicOptions) {

        if (!cubicOptions) throw new Error('Now options specified');

        this.setValues(cubicOptions);

        let startObject = (this.startObject instanceof THREE.Object3D) ? this.startObject.position : this.startObject;
        let endObject = (this.startObject instanceof THREE.Object3D) ? this.endObject.position : this.endObject;

        let x = startObject.x;
        let y = startObject.y;
        let z = startObject.z;

        let eX = endObject.x;
        let eY = endObject.y;
        let eZ = endObject.z;

        let points = new THREE.CubicBezierCurve3(
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(x + 70, y, z),
            new THREE.Vector3(x + 30, y + 80, z),
            new THREE.Vector3(eX, eY, eZ)
        ).getPoints(500);

        // geometry
        let geometry = new THREE.BufferGeometry();

        // material
        let material = new THREE.LineBasicMaterial({ color: cubicOptions.color, linewidth: 2 });

        // line
        let line = new THREE.Line(geometry, material);

        let pointsLen = points.length;

        line.points = points;

        // attributes
        let positions = new Float32Array(pointsLen * 3); // 3 vertices per point

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        addPositions(line, points);

        return line;

    }

    Circle.prototype = new Visual();

    function Circle() {
        this.startPosition;
        this.startAngle;
        this.resolution;
        this.color;
        this.radius;
        this.segments;
        this.opacity;
    }

	/**
	 * @author iisaiah
	 * @param {CircleOptions} circleOptions 
	 * 
	 * Parameters for CubicOptions
	 * {THREE.Object3D || THREE.Vector3} startPosition
	 * {Number} startAngle Which angle to start drawing the circle
	 * {Number} resolution Completion of circle
	 * {Number} radius
	 * {HEX} color 
	 */
    Circle.prototype.drawBorderCircle = function (circleOptions) {

        if (!circleOptions) throw new Error('No options defiend');
        if (typeof circleOptions.radius === 'undefined') circleOptions.radius = 100;
        if (typeof circleOptions.resolution === 'undefined') circleOptions.resolution = 361;

        this.setValues(circleOptions);

        let angle = 0
        let points = [];

        let x = 0, y = 0, z = 0;

        let startPosition = (this.startPosition instanceof THREE.Object3D) ? this.startPosition.position : this.startPosition;

        // Plot the points of the circle;
        for (let i = 0; i < this.resolution; i++) {

            // Set i as the angle;
            if (this.startAngle) angle = this.startAngle++;
            else angle = i;

            // Plot the x y coordinates
            x = startPosition.x + (this.radius * Math.cos(toRadians(angle)));
            y = startPosition.y + (this.radius * Math.sin(toRadians(angle)));
            z = startPosition.z + 0;

            points.push(new THREE.Vector3(x, y, z));

        }

        // geometry
        let geometry = new THREE.BufferGeometry();

        // material
        let material = new THREE.LineBasicMaterial({ color: this.color });

        // circle
        var circle = new THREE.Line(geometry, material);

        let pointsLen = points.length;

        circle.points = points;

        // attributes
        let positions = new Float32Array(pointsLen * 3); // 3 vertices per point

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        addPositions(circle, points);

        return circle;
    }

    Circle.prototype.drawThickCircle = function (circleOptions, multiplier, segment) {

        let circles = [];

        for (let i = 0; i < multiplier; i++) {

            var circle = this.drawBorderCircle(circleOptions);

            circles.push(circle);

            circleOptions.radius += segment;

        }

        return circles;
    }

    Circle.prototype.drawCircle = function (circleOptions) {

        this.setValues(circleOptions);

        var geometry = new THREE.CircleGeometry(this.radius, 80);

        // Remove center vertex
        geometry.vertices.shift();

        let startPosition = (this.startPosition instanceof THREE.Object3D) ? this.startPosition.position : this.startPosition;

        var material = new THREE.LineBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: this.opacity,
            side: THREE.DoubleSide
        });

        var circle = new THREE.Mesh(geometry, material);

        circle.position.x = startPosition.x;
        circle.position.y = startPosition.y;
        circle.position.z = startPosition.z;

        // circle.rotation.x = Math.PI / 2;

        return circle;
    }

    Sphere.prototype = new Visual();

    function Sphere() {
        this.radius;
        this.color;
        this.startPosition;
        this.opacity;
    }

    Sphere.prototype.drawSphere = function (circleOptions) {

        if (!circleOptions) return;

        this.setValues(circleOptions);

        let geometry = new THREE.SphereGeometry(this.radius, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        let material = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: this.opacity
        }
        );

        let sphere = new THREE.Mesh(geometry, material);

        let startPosition = (this.startPosition instanceof THREE.Object3D) ? this.startPosition.position : this.startPosition;

        sphere.position.x = startPosition.x;
        sphere.position.y = startPosition.y;
        sphere.position.z = startPosition.z;

        return sphere;

    }

    /**
     * @author iisaiah
     * 
     * @param {Array} points contains array of vertices
     * @param {Hex} color 
     * @param {opacity} opacity 
     */
    let connectNodesLines = function (points, color, opacity) {

        let material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity
        });

        let geometry = new THREE.BufferGeometry();

        var line = new THREE.Line(geometry, material);

        line.points = points;

        // attributes
        let positions = new Float32Array(points.length * 3); // 3 vertices per point

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

        addPositions(line, points);

        return line;
    }

	/**
	 * @author iisaiah
	 * 
	 * @param {THREE.Object3D} threeObj 
	 * @param {Number} pointsLen 
	 * @param {Number} speed 
	 */
    let animateLine = function (threeObj, pointsLen, speed, scene) {

        if (!threeObj) throw new Error('Three Object is not defined');
        if (!pointsLen) throw new Error('Point length is not defined');
        if (!speed) throw new Error('Speed is not defined');

        threeObj.geometry.setDrawRange(0, 0); // Starts the buffered geometry add point 0
        (scene) ? scene.add(threeObj) : sceneGL.add(threeObj);

        var drawCount = 0;
        var animation = setInterval(function () {
            if (drawCount >= pointsLen) clearInterval(animation);

            drawCount = (drawCount + speed);
            threeObj.geometry.setDrawRange(0, drawCount);
        }, 10);

    }

    let animateThickLine = function (circles, speed, scene) {

        circles.forEach(function (circle) {

            this.animateLine(circle, circle.points.length, speed, scene);

        }, this);

    }

    /**
 * @author iisaiah
 * 
 * @param {THREE.Object3D} threeObj 
 * @param {Array} points Array of THREE.Vector3 objects
 */
    function addPositions(threeObj, points) {
        let positions = threeObj.geometry.attributes.position.array;

        let index = 0;

        for (let i = 0, l = points.length; i < l; i++) {
            positions[index++] = points[i].x;
            positions[index++] = points[i].y;
            positions[index++] = points[i].z;
        }
    }

    function setParams(values) {
        for (let key in values) {

        }
    }

    function toRadians(angle) {
        return angle * Math.PI / 180;
    }

    return {

        CubicBezier: CubicBezier,
        Circle: Circle,
        Sphere: Sphere,
        animateLine: animateLine,
        animateThickLine: animateThickLine,
        connectNodesLines: connectNodesLines,
    }

}());



