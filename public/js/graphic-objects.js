function CircleNode() {
	this.name;
	this.circle;
	this.radius;
	this.angle; // Stores the last inserted angle
	this.eAngle; // Stores the last inserted end point angle
	this.map = {};
	this.curve = [];
	this.lineTable = [];
	this.traversalLineTable = [];
	this.childCircles = [];
	this.barScore = [];
	this.process;
	this.label;
	this.object;
	this.thickCircles = [];
}

CircleNode.prototype.addCurveLinePair = function(curve, line) {
	this.curve.push(curve);
	this.lineTable.push(line);
};

CircleNode.prototype.addChildCircle = function(circle) {
	this.childCircles.push(circle);
};

CircleNode.prototype.addBarScore = function(bar) {
	this.barScore.push(bar);
};

CircleNode.prototype.addTraversalLine = function(line) {
	this.traversalLineTable.push(line);
};

CircleNode.prototype.copyThickCircles = function(lines) {
	for(var i = 0; i < lines.length; i++) {
		this.thickCircles.push(lines[i]);
	}
};

CircleNode.prototype.addThickCircles = function(object) {
	this.thickCircles.push(object);
};

function LineSettings(color, speed) {
	this.color = color;
	this.speed = speed;
}