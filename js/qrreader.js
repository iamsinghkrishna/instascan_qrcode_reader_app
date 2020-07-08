var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var qrOutput = document.getElementById("qrOutput");

var qrcodeContainer = document.getElementById("qrcodeContainer");
var qrcodeButton = document.getElementById("qrcodeButton");

//This variable(MediaStream type) holds the streaming data capture from WebCam 
var webcamStream;

//QR code turn on and off switch
function qrcodeReaderSwitch(){
  if(qrcodeContainer.hidden===true){
    qrcodeContainer.hidden = false;
    qrcodeButton.textContent = "Turn off QR code reader";

    //Open device webcam
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      webcamStream = stream;
      video.srcObject = webcamStream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    });
  }else{
    qrcodeContainer.hidden = true;
    qrcodeButton.textContent = "Turn on QR code reader";

    //Close device webcam
    webcamStream.getVideoTracks()[0].stop();
  }
}

//Draw a line
function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

function tick() {
  loadingMessage.innerText = "Loading video...";

  //Checking if video/webcam stream has any data
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;

    //Settin up of canvas element
    canvasElement.hidden = false;
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    //Get the imagaData from Canvas(Webcam streamming)
    var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    
    /*Calling to jsQR library(Apache Lincense 2.0 open source, github link: https://github.com/cozmo/jsQR, 
      license link: https://github.com/cozmo/jsQR/blob/master/LICENSE) to scan the 
      imageData retrieve from device webcam stream.
      Input Data: imageData data, width, height and additional object data.
      Output Data: code which captures information of QR code
    */
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
      drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
      drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
      drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
      
      //Setting up qr code info to html element
      qrOutput.innerText = code.data;
      console.log(code.data);
    } else {
      qrOutput.innerText = 'No Data Found!!!';
    }
  }
  requestAnimationFrame(tick);
}