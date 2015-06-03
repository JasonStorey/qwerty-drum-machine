var audio_context;
var recorder;

var startButton = document.createElement('button');
var stopButton = document.createElement('button');
var recordingslist = document.createElement('ul');

startButton.innerHTML = 'record';
startButton.addEventListener('click', function(event) {
    startRecording(event.target);
});

stopButton.innerHTML = 'stop';
stopButton.setAttribute('disabled', true);

stopButton.addEventListener('click', function(event) {
    stopRecording(event.target);
});

document.body.appendChild(startButton);
document.body.appendChild(stopButton);
document.body.appendChild(recordingslist);

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    //input.connect(audio_context.destination);

    recorder = new Recorder(input);
    console.log('Recorder initialised.');
}

function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    stopButton.disabled = false;
    console.log('Recording...');
}

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    startButton.disabled = false;
    console.log('Stopped recording.');

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
}

function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');

        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);
    });
}

window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        console.log('No live audio input: ' + e);
    });
};