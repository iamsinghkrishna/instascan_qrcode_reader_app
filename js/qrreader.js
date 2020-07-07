var webcam_scanner = document.getElementById('webcam_scanner');
var scan_result = document.getElementById('scan_result');
var camera_check = document.getElementById('camera_check');

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            webcam_scanner.srcObject = stream;
        })
        .catch(function (err0r) {
            console.error("Something went wrong!");
        });
}

var scanner = new Instascan.Scanner({ video: webcam_scanner });
scanner.addListener('scan', function (content) {
    console.log(content);
    scan_result.innerHTML = content;
});

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        console.log('Cameras found.');
        camera_check.innerHTML = 'Cameras found.';
        scanner.start(cameras[0]);
    } else {
        console.error('No cameras found.');
        camera_check.innerHTML = 'No cameras found.';
    }
}).catch(function (e) {
    console.error(e);
});