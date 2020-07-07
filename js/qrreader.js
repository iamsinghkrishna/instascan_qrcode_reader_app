var webcam_scanner = document.getElementById('webcam_scanner');
var scan_result = document.getElementById('scan_result');
var camera_check = document.getElementById('camera_check');

var scanner = new Instascan.Scanner({ video: webcam_scanner });
scanner.addListener('scan', function (content) {
    console.log(content);
    scan_result.innerHTML = content;
});

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        console.error('Cameras found.');
        camera_check.innerHTML = 'Cameras found.';
        scanner.start(cameras[0]);
    } else {
        console.error('No cameras found.');
        camera_check.innerHTML = 'No cameras found.';
    }
}).catch(function (e) {
    console.error(e);
});