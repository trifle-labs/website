"use strict";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var numOfSides = 3;
var step = ((numOfSides - 1) * Math.PI) / 360;
var radius = 200;

var dragStart = false;
var angle = 0;
const initialSpeed = 1.047;
var speed = 0; //initialSpeed * 2;
// document.getElementById("svalue").innerHTML = speed;
ctx.strokeStyle = "rgb(234, 158, 184)";
ctx.lineWidth = radius / 5.5;

function spin() {
  speed = document.getElementById("svalue").innerHTML;
}

function verifyorder() {
  speed = document.getElementById("value").value;
  document.getElementById("svalue").innerHTML = speed;
}

canvas.addEventListener("mousedown", function (_ref) {
  var clientX = _ref.clientX;
  var clientY = _ref.clientY;

  dragStart = { clientX: clientX, clientY: clientY };
});
canvas.addEventListener("touchstart", function (_ref2) {
  var originalEvent = _ref2.originalEvent;

  dragStart = {
    clientX: originalEvent.touches[0].pageX,
    clientY: originalEvent.touches[0].pageY,
  };
});
canvas.addEventListener("mousemove", function (_ref3) {
  var clientX = _ref3.clientX;
  var clientY = _ref3.clientY;
  return (
    dragStart &&
    (function () {
      updateSpeed(dragStart, { clientX: clientX, clientY: clientY });
      dragStart = { clientX: clientX, clientY: clientY };
    })()
  );
});
canvas.addEventListener("touchmove", function (_ref4) {
  var originalEvent = _ref4.originalEvent;
  return (
    dragStart &&
    (function () {
      updateSpeed(dragStart, {
        clientX: originalEvent.touches[0].pageX,
        clientY: originalEvent.touches[0].pageY,
      });
      dragStart = {
        clientX: originalEvent.touches[0].pageX,
        clientY: originalEvent.touches[0].pageY,
      };
    })()
  );
});
window.addEventListener("mouseup", function () {
  dragStart = false;
});
window.addEventListener("touchend", function () {
  dragStart = false;
});
let images = [];
for (let i = 0; i < numOfSides; i++) {
  images[i] = new Image();
  images[i].src = "face8_" + (i + 1) + ".png";
  // images[i].onload = function () {
  //   if (images[i].loaded) return;
  //   console.log("img loaded", i);
  //   var canvas = document.createElement("canvas");
  //   var ctx = canvas.getContext("2d");
  //   canvas.width = images[i].width;
  //   canvas.height = images[i].height;
  //   ctx.drawImage(images[i], 0, 0);
  //   var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   var data = imageData.data;
  //   for (var j = 0; j < data.length; j += 4) {
  //     data[j] = 255 - data[j]; // red
  //     data[j + 1] = 255 - data[j + 1]; // green
  //     data[j + 2] = 255 - data[j + 2]; // blue
  //   }
  //   ctx.putImageData(imageData, 0, 0);
  //   images[i].loaded = true;
  //   images[i].src = canvas.toDataURL();
  // };
  // images[i].src = "face8_" + (i + 1) + ".png";
  images[i].onload = function () {
    console.log("img loaded", i);
  };
}

function updateSpeed(startPos, endPos) {
  // console.log({ startPos, endPos });
  speed =
    (Math.atan2(
      endPos.clientX - (canvas.offsetLeft + canvas.width / 2),
      endPos.clientY - (canvas.offsetTop + canvas.height / 2)
    ) -
      Math.atan2(
        startPos.clientX - (canvas.offsetLeft + canvas.width / 2),
        startPos.clientY - (canvas.offsetTop + canvas.height / 2)
      )) *
    2;
}
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  angle += speed;
  const friction = dragStart ? 0 : 0.01;
  speed = Math.max(speed - friction, Math.min(speed + friction, 0));
  // speed = 1.047
  // document.getElementById("svalue").innerHTML = speed;
  const r = radius / 2;
  const color = "red";

  for (var i = 0; i < numOfSides; i++) {
    var x = canvas.width / 2 + radius * Math.sin(angle + i * (120 * step));
    var y = canvas.height / 2 - radius * Math.cos(angle + i * (120 * step));
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    // ctx.fillStyle = "rgb(234, 158, 184)"; // Set fill color
    ctx.fillStyle = color; // Set fill color
    ctx.fill(); // Fill the circle
    ctx.closePath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + i * (120 * step));
    ctx.drawImage(images[i], -r, -r, radius, radius);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  // ctx.beginPath();
  // ctx.lineWidth = 90;
  // ctx.arc(canvas.width / 2, canvas.height / 2 - radius, radius, 0, 3 * Math.PI);
  // ctx.strokeStyle = "#000";
  // ctx.stroke();
  // ctx.fillStyle = "rgba(0,0,0,0)";
  // ctx.fill();
  // ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = radius / 5.5;
  const margin = speed / initialSpeed - Math.floor(speed / initialSpeed);

  // console.log({ margin });
  if (margin < 0.1 && speed > 0.1) {
    setTimeout(() => {
      render();
      // }, speed * 2);
    }, 1000 / 10);
  } else {
    window.requestAnimationFrame(render);
  }
}

render();
