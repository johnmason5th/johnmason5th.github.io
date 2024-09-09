//Customizable
const CELL_SIZE = 3;
const WORLD_WIDTH = 200;
const WORLD_HEIGHT = 200;

//Sets canvas to world size
document.getElementById("canvas").width = WORLD_WIDTH*CELL_SIZE;
document.getElementById("canvas").height = WORLD_HEIGHT*CELL_SIZE;

strokeStyle("white");

//Create world
let world = new World(WORLD_WIDTH,WORLD_HEIGHT);

//Sample particles
for (let x = 20; x < 60; x++) {
  for (let y = 20; y < 60; y++) {
    world.createParticleAt(x, y, "dust");
  }
}
for (let x = 25; x < 75; x++) {
  for (let y = 65; y < 85; y++) {
    world.createParticleAt(x, y, "ice");
  }
}
for (let x = 30; x < 80; x++) {
  for (let y = 90; y < 100; y++) {
    world.createParticleAt(x, y, "water");
  }
}
for (let x = 100; x < 120; x++) {
  for (let y = 40; y < 50; y++) {
    world.createParticleAt(x, y, "steam");
  }
}


function updateParticles() {
  for (let particle of world.particles) {
		particle.update();
  }
}

let step = 0;
function updatePhysics() {
  updateParticles();
  
	if (document.getElementById("step") !== null)
		document.getElementById("step").innerHTML= "Step: "+(++step);
}

function draw() {
  //background
  fill("rgb(0,0,0)");
  rect(0,0,WORLD_WIDTH*CELL_SIZE,WORLD_HEIGHT*CELL_SIZE);
	
  //Draw particles
  for (let particle of world.particles) {
				let cell = particle.cell;
      fill(particle.color);
     rect(cell.x*CELL_SIZE,cell.y*CELL_SIZE,CELL_SIZE,CELL_SIZE);
  }
	
  userInput();
	//Brush cursor
  if (!mouseOut) {
    fill("transparent");
    rect(mouseX-cursorSize*CELL_SIZE, mouseY-cursorSize*CELL_SIZE, cursorSize*CELL_SIZE*2, cursorSize*CELL_SIZE*2);
  }
}


const FRAMES_PER_SECOND = 60;  // Valid values are 60,30,20,15,10
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time
function updateFrame(time){
    if(time-lastFrameTime < FRAME_MIN_TIME){ //skip the frame if the call is too early
        requestAnimationFrame(updateFrame);
        return; // return as there is nothing to do
    }
    
    draw();
    document.getElementById("fps").innerHTML = "FPS: "+Math.round(1000.0/Math.abs(lastFrameTime-time));
    
    lastFrameTime = time; // remember the time of the rendered frame
    // render the frame
    requestAnimationFrame(updateFrame);
}
window.requestAnimationFrame(updateFrame);
var timer = new IntervalTimer(function() {updatePhysics();},30);