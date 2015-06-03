var audioContext;
var recorder;
var recordingslist = document.createElement('ul');

document.body.appendChild(recordingslist);

function startUserMedia(stream) {
    var input = audioContext.createMediaStreamSource(stream);
    console.log('Media stream created.');
    //input.connect(audioContext.destination);

    recorder = new Recorder(input);
    console.log('Recorder initialised.');
    init();
}

window.onload = function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audioContext = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        console.log('No live audio input: ' + e);
    });
};

function Trigger(options) {
    this.keyCode = options.keyCode;
    this.recorder = options.recorder;
}

Trigger.prototype = {
    init: function() {
        this.container = document.createElement('div');
        this.startButton = document.createElement('button');
        this.stopButton = document.createElement('button');
        this.display = document.createElement('ul');

        this.startButton.innerHTML = 'record';
        this.startButton.addEventListener('click', function() {
            this.startRecording();
        }.bind(this));

        this.stopButton.innerHTML = 'stop';
        this.stopButton.setAttribute('disabled', true);

        this.stopButton.addEventListener('click', function() {
            this.stopRecording();
        }.bind(this));

        this.container.appendChild(this.display);
        this.container.appendChild(this.startButton);
        this.container.appendChild(this.stopButton);
    },
    draw: function() {
        document.body.appendChild(this.container);
    },
    startRecording: function() {
        this.recorder.record();
        this.startButton.disabled = true;
        this.stopButton.disabled = false;
        console.log('Recording...');
    },
    stopRecording: function() {
        this.recorder.stop();
        this.stopButton.disabled = true;
        this.startButton.disabled = false;
        while (this.display.hasChildNodes()) {
            this.display.removeChild(this.display.lastChild);
        }
        console.log('Stopped recording.');

        // create WAV download link using audio data blob
        this.recorder.exportWAV(function(blob) {
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
            this.display.appendChild(li);
        }.bind(this));

        this.recorder.clear();
    }
};

function init() {
    var trigger = new Trigger({
        keyCode:65,
        recorder: recorder
    });

    trigger.init();
    trigger.draw();
}
