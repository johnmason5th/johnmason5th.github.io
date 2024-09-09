const WORLD_WIDTH = 400;
const WORLD_HEIGHT = 400;

//Sets canvas to world size
document.getElementById("canvas").width = WORLD_WIDTH;
document.getElementById("canvas").height = WORLD_HEIGHT;

fill("white");
rect(0,0,WORLD_WIDTH,WORLD_HEIGHT);

strokeStyle("black");

let brushSize = 10;
fill("black");

let red = 0;
let green = 0;
let blue = 0;

let CDctx = document.getElementById("colorDisplay").getContext("2d");

CDctx.fillStyle = "black";
CDctx.fillRect(0,0,50,50);

function updateColorDisplay() {
	strokeStyle("rgb("+red+", "+green+", "+blue+")");
	fill("rgb("+red+", "+green+", "+blue+")");
	CDctx.fillStyle="rgb("+red+", "+green+", "+blue+")";
	CDctx.fillRect(0,0,50,50);
}

function setBrushSize(value) {
	brushSize = value;
}

function setRed(value) {
	red = value;
	updateColorDisplay();
}

function setGreen(value) {
	green = value;
	updateColorDisplay();
}

function setBlue(value) {
	blue = value;
	updateColorDisplay();
}

let pMouseX = 0;
let pMouseY = 0;
function draw() {
	if(mouseIsDown) {
		strokeWeight(1);
		circle(pMouseX,pMouseY,brushSize/2-1);
		strokeWeight(brushSize);
		line(mouseX,mouseY,pMouseX,pMouseY);
		strokeWeight(1);
		circle(mouseX,mouseY,brushSize/2-1);
	}
  // userInput();
	//Brush cursor
  // if (!mouseOut) {
    // fill("transparent");
    // rect(mouseX-cursorSize*CELL_SIZE, mouseY-cursorSize*CELL_SIZE, cursorSize*CELL_SIZE*2, cursorSize*CELL_SIZE*2);
  // }
	pMouseX = mouseX;
	pMouseY = mouseY;
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
    
    lastFrameTime = time; // remember the time of the rendered frame
    // render the frame
    requestAnimationFrame(updateFrame);
}
window.requestAnimationFrame(updateFrame);
var timer = new IntervalTimer(function() {updatePhysics();},30);