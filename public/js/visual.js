function drawCircleBorder(radius, resolution, pX, pY, pZ, name, color, opacity, animationSpeed, startAngle) {
	var circleNode = new CircleNode();
	
	var x, y, z;
	
	var geometry = new THREE.BufferGeometry();
	var material = new THREE.LineDashedMaterial( {
		color: color,
		dashSize: 1, // to be updated in the render loop
		gapSize: 1e10 // a big number, so only one dash is rendered
	});
	
	material.transparent = true;
	material.opacity = opacity;
	
	var points = [];
	var pointsLength = 0;
	var angle;
	
	// Plot the points of the circle;
	for(var i = 0; i < resolution; i++) {
		// Set i as the angle;
		if(startAngle) angle = startAngle++;
		else angle = i;
		
		// Plot the x y coordinates
		x = radius * Math.cos(toRadians(angle));
		y = radius * Math.sin(toRadians(angle));
		z = 0;
		
		points.push(new THREE.Vector3(x, y, z));
	}
	
	// Get the number of points
	pointsLength = points.length;
	var positions = new Float32Array(pointsLength * 3); // 3 vertices per point
	var lineDistances = new Float32Array(pointsLength * 1); // 1 value per point
	
	geometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute( 'lineDistance', new THREE.BufferAttribute(lineDistances, 1));
	
	for (var i = 0, index = 0; i < pointsLength; i ++, index += 3) {
		positions[index] = points[i].x;
		positions[index + 1] = points[i].y;
		positions[index + 2] = points[i].z;
		
		if (i > 0) {
			lineDistances[i] = lineDistances[i - 1] + points[i - 1].distanceTo(points[i]);
		}
	}
	
	var lineLength = lineDistances[ pointsLength - 1 ];
	
	var circle = new THREE.Line(geometry, material);
	circle.lineLength = lineLength;
	
	// Position
	circle.position.x = pX;
	circle.position.y = pY;
	circle.position.z = pZ;
	
	circleNode.circle = circle;
	circleNode.radius = radius;
	circleNode.name = name;
	
	sceneGL.add(circle);
	
	animateLine(circle, null, animationSpeed, true);
	
	return circleNode;
}

function animateLine(line, threeObject, speed, toAdd) {
	var fraction = 0;
	line.material.initial = line.material.dashSize;
	
	var interval = setInterval(function() {
		try {
			if (fraction < 1.1) {
				fraction += 0.01;
				line.material.dashSize = fraction * line.lineLength;
			}
			else {
				// When the animation has ended, Add the circles)
				if (threeObject != null && toAdd) {
					if (!(threeObject instanceof THREE.CSS3DObject)) {
						sceneGL.add(threeObject);
					}
				}
				
				clearInterval(interval);
			}
		}
		catch(err) {
			clearInterval(interval);
		}
	}, speed);
}

function drawThickCircle(radius, resolution, pX, pY, pZ, thickness, color, opacity, name) {
	var lines = [];
	for(var i = 0; i < thickness; i++) {
		var border = drawCircleBorder(radius, resolution, pX, pY, pZ, '', color, opacity, 20).circle;
		border.name = name;
		lines.push(border);
		radius += 0.5;
	}
	
	return lines;
}