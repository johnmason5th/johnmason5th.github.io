var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Canvas Functions
function line(x1,y1,x2,y2) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}
function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x,y,r,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();
}
function rect(x,y,w,h) {
  ctx.beginPath();
  if (ctx.fillStyle == "rgba(0, 0, 0, 0)") {
    ctx.rect(x,y,w,h);
  } else {
    ctx.fillRect(x,y,w,h);
  }
  ctx.stroke();
}
function fontSize(size) {
  ctx.font = size+"px Arial";
}
function text(text,x,y) {
  fill("black");
  ctx.fillText(text,x,y);
}
function fill(color) {
  ctx.fillStyle = color;
}
function strokeStyle(color) {
  ctx.strokeStyle = color;
}
function strokeWeight(weight) {
	ctx.lineWidth = weight;
}
function clear() {
  const transform = ctx.getTransform();
  const { x, y } = transform.transformPoint(new DOMPoint(0, 0));

  ctx.clearRect(-x, -y, canvas.width, canvas.height);
}
function save() {
  ctx.save();
}
function translate(x,y) {
  ctx.translate(x,y);
}
function zoom(scale) {
  ctx.scale(scale,scale);
}
function restore() {
  ctx.restore();
}

//User Input Functions
var keyCode = "";
var keyDown = false;
// canvas.addEventListener("keydown", function(e) {
//   keyCode = e.key;
//   keyDown = true;
//   keyDownMap[e.key] = true;
// });
// canvas.addEventListener("keyup", function(e) {
//   keyDown = false;
//   keyDownMap[e.key] = false;
// });
// var keyDownMap = {
//   "ArrowUp":false,
//   "ArrowDown":false,
//   "ArrowLeft":false,
//   "ArrowRight":false,
//   "1":false,
//   "2":false,
//   "3":false,
//   "4":false,
//   "5":false,
//   "6":false,
//   "7":false,
//   "8":false,
//   "9":false,
//   "0":false,
//   " ":false
// };

// function keyIsDown(key) {
//   return keyDownMap[key];
// }
// function keyPressed() {
  
// }

//Mouse
let mouseX = 0;
let mouseY = 0;

let mouseOut = true;
let mouseIsDown = false;

function  getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("mousemove", function(e) {
  mouseOut = false;
	if (typeof mouseMove === "function") {
		mouseMove(e);
	}
	
  var pos = getMousePos(canvas, e);
  var matrix = ctx.getTransform();
  var imatrix = matrix.invertSelf();
  // apply to point:
  mouseX = pos.x * imatrix.a + pos.y * imatrix.c + imatrix.e;
  mouseY = pos.x * imatrix.b + pos.y * imatrix.d + imatrix.f;
});

canvas.addEventListener("mousedown", function(e) {
  mouseIsDown = true;
});

canvas.addEventListener("mouseup", function(e) {
  mouseIsDown = false;
});

canvas.addEventListener("mouseout", function(e) {
  mouseOut = true;
});

// canvas.addEventListener("wheel", function(e) {
//   if (typeof mouseWheel === "function") {
// 		mouseWheel(e);
// 	}
// });

//IntervalTimer
  //Credit: Felix Kling, https://stackoverflow.com/questions/24724852/pause-and-resume-setinterval
function IntervalTimer(callback, interval) {
  var timerId, startTime, remaining = 0;
  var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

  this.pause = function () {
    if (state != 1) return;

    remaining = interval - (new Date() - startTime);
    window.clearInterval(timerId);
    state = 2;
  };

  this.resume = function () {
    if (state != 2) return;

    state = 3;
    window.setTimeout(this.timeoutCallback, remaining);
  };

  this.timeoutCallback = function () {
    if (state != 3) return;

    callback();

    startTime = new Date();
    timerId = window.setInterval(callback, interval);
    state = 1;
  };

  startTime = new Date();
  timerId = window.setInterval(callback, interval);
  state = 1;
}

//Miscellaneous
function randomInt(start,end) {
  return start+Math.floor(Math.random() * (end-start));
}



//Debug display
function printToDebug(text) {
	if (document.getElementById("debug-display")===null) return;
  document.getElementById("debug-display").innerHTML = text+"<br>"+document.getElementById("debug-display").innerHTML;
}