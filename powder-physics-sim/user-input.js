let cursorMode = "draw";
function setCursorMode(mode) { cursorMode = mode; }

let cursorSize = 1;
function setCursorSize(size) { cursorSize = size; }

let selectedParticle = "dust";
function setDrawParticle(particle) { selectedParticle = particle; }

let tempMode = "heat";
function setTempMode(temp) { tempMode = temp; }

function drawTool(cell) {
	world.createParticleAt(cell.x,cell.y,selectedParticle);
}

function eraseTool(cell) {
	world.deleteParticleAt(cell.x,cell.y);
}

function tempTool(cell) {
	if			(tempMode == "heat" && cell.particle.temp < 257 )
		cell.particle.temp+=1;
	else if (tempMode == "cool" && cell.particle.temp > -257)
		cell.particle.temp-=1;
}

function leftClickFunctions() {
  for (let x = -cursorSize; x < cursorSize; x++) {
    for (let y = -cursorSize; y < cursorSize; y++) {
      if (mouseOut || !world.inBounds(mouseCellX+x,mouseCellY+y)) 	
				continue;
			let cell = world.getCell(mouseCellX+x,mouseCellY+y);
			if (cell.particle === null) {
				if (cursorMode == "draw") {
					drawTool(cell);
				}
      } else {
				if (cursorMode == "erase") {
					eraseTool(cell);
				} else if (cursorMode == "temp") {
					tempTool(cell);
				}
			}
    }
  }
}

function inspectTool() {
	if (mouseOut || world.getCell(mouseCellX,mouseCellY).particle === null) {
    document.getElementById('particle-info').innerHTML= '';
  } else {
    document.getElementById('particle-info').innerHTML= world.getCell(mouseCellX,mouseCellY).particle.type+", "+world.getCell(mouseCellX,mouseCellY).particle.temp+"C";
  }
}

let mouseCellX = 0;
let mouseCellY = 0;
function userInput() {
  mouseCellX = Math.floor(mouseX/CELL_SIZE);
  mouseCellY = Math.floor(mouseY/CELL_SIZE);
  if (mouseCellX<0) mouseCellX=0;
  if (mouseCellY<0) mouseCellY=0;
  
  inspectTool();
	
  if (mouseIsDown) {
    leftClickFunctions();
  }
}
