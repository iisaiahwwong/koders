let peopleParticles;
let obj;
let circles;

function People() {

}

function initVisualMap() {

    drawBorder();

    peopleParticles = intialiseParticleBuffer(5000, 500, 50);
    
    reorderParticles();

    seedPeopleData(2000);

    density();

}

function expand() {
    let index, radius, angle;   
    let geometry = peopleParticles.geometry;
    let attributes = geometry.attributes;

    for(let i = 0; i < 200; i++) {
        
        attributes.size.array[getRandomInt(0, 200-1)] = 80;

        attributes.position.needsUpdate = true;
    }
}

function reorderParticles() {

    let index, radius, angle;   
    let geometry = peopleParticles.geometry;
    let attributes = geometry.attributes;

    for(let i = 0; i < 5000; i++) {

        index = i * 3;

        radius = getRandomInt(0, 1000);
        angle = getRandomInt(0, 360);
        
        attributes.position.array[index] = 100 + (radius * Math.cos(toRadians(angle)));
        attributes.position.array[index + 1] = -100 + (radius * Math.sin(toRadians(angle)));
        attributes.position.array[index + 2] = 0;

        attributes.position.needsUpdate = true;

    }

}

function drawBorder() {

    // Draw border
    let circle = new VISUAL.Circle();
    
    circles =  circle.drawThickCircle({
        startPosition: new THREE.Vector3(100, -100, 0),
        color: 0x05FFD2,
        resolution: 361,
        startAngle: 0,
        radius: 1000,
    }, 20, 0.5);

    let obj = circles[0];

    console.log(obj);

    VISUAL.animateThickLine(circles, 2);

}

function seedPeopleData(total) {

    let index = 0;

    let interval = setInterval(function () {
        index++;

        if (index == total) clearInterval(interval);

        let people = new People();

        pushParticles(people);

    }, 1);

}

function pushParticles(people) {

    if (!(people instanceof People)) return;

    let userData = peopleParticles.userData;

    let color = new THREE.Color();

    for (let key in userData) {

        if (userData[key] instanceof People) continue;

        userData[key] = people;

        let geometry = peopleParticles.geometry;
        let attributes = geometry.attributes;

        let index = key * 3;

        color.set(0x17BCDE);
        
        attributes.customColor.array[index] = color.r;
        attributes.customColor.array[index + 1] = color.g;
        attributes.customColor.array[index + 2] = color.b;
        attributes.customColor.needsUpdate = true;

        let x = attributes.position.array[index];
        let y = attributes.position.array[index + 1];
        let z = attributes.position.array[index + 2];            
        
        attributes.opacity.array[key] = 1;

        attributes.opacity.needsUpdate = true;
        
        break;

    }
}

function density() {
    
    setInterval(function() {
        let distance = getDistance(camera, new THREE.Vector3(0, 0,0));

        let geometry = peopleParticles.geometry;
        let attributes = geometry.attributes;

        for(let i = 0; i < 2000; i++) {
            
            attributes.size.array[i] = 0.045 * distance;

            attributes.size.needsUpdate = true;
        }

        let s = Math.pow(distance, -1) * 3000;


        for(let i = 0; i < circles.length; i++) {

            if(s < 1)
                break;
            if(s > 1.2) s = 1.2;

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
