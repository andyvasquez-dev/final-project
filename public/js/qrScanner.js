console.log('connected to qrScanner.js');
//qr code obj... originally declared but throwing err,appears to be already declared in other script
qrcode = window.qrcode;

//video element to handle images coming from the camera
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");

//uses the canvas element to assign the 2d context to a constant, need this to draw images coming from camera in the following decs
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

//following is to keep the status of the variable
let scanning = false;


// This will be called by the library when it detects a QR code
// res parameter containing the result of the scan
qrcode.callback = (res) => {
  if (res) {
    // /////////////////////////stimulate a mouse click ///////////////////////////////////////
    window.location.href = res
    // outputData.innerText = res;

    // to not scan anymore after the qr codes is decoded
    scanning = false;
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    //displays result and trigger another scan
    qrResult.hidden = false;
    btnScanQR.hidden = false;
    // hide the canvas element, since it isnt needed anymore.
    canvasElement.hidden = true;
  }
};

// to accesscamera feed, loop to draw the images in our canvas every frame
// need another loop to scan for qr codes every x miliseconds.
// - Scanning every frame would be a waste of resources,
// - so we’re better off handling that in a separate loop where we can control the frequency in which we run the algorithm.

btnScanQR.onclick = () => {// calling getUserMedia func from mediaDevices OBJ, part of navigator OBJ
  navigator.mediaDevices   // will make the browser ask the user for permission
    .getUserMedia({ video: { facingMode: "environment" } }) // will try to get the backside camera first
    .then(function(stream) { //returns promise, following code runs
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan(); // to trigger alogrithm
    });
};

function tick() {
  // setting h & w to the dimensions of the video
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;

  //draws the video to the canvas
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  // tick() will be called again when the browser draws the next frame.
  // doing this conditionally to the scanning variable being true.
  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    //runs the decode function from the qrcode library, which will look for a canvas with an ID of
    // "qr-canvas" and scan its contents. if nothings found, the error defined will be caught
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300); // the amount of time between each scan, the faster the more demanding from the users device.
  }
}
