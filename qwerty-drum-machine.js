var audioContext;

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

function startUserMedia(stream) {
    var input = audioContext.createMediaStreamSource(stream);
    console.log('Media stream created.');
    //input.connect(audioContext.destination);

    var recorder = new Recorder(input);
    console.log('Recorder initialised.');
    initQDM(recorder);
}

function initQDM(recorder) {
    var triggers = [],
        KEY_CODES = [65, 83, 68, 70, 71, 72, 74, 75, 76];

    for(var i = 0; i < KEY_CODES.length; i++) {
        triggers.push(new Trigger({
            keyCode: KEY_CODES[i],
            recorder: recorder,
            label: 'Trigger #' + i
        }));

        triggers[i].init();
        triggers[i].draw();
    }

    window.addEventListener('keydown', checkKeyPressed, false);
    window.addEventListener('keyup', checkKeyReleased, false);

    function checkKeyPressed(e) {
        triggers.forEach(function(trigger) {
            if (e.keyCode == trigger.keyCode) {
                trigger.startSource();
            }
        });
    }

    function checkKeyReleased(e) {
        triggers.forEach(function(trigger) {
            if (e.keyCode == trigger.keyCode) {
                trigger.stopSource();
            }
        });
    }
}

function Trigger(options) {
    this.keyCode = options.keyCode;
    this.recorder = options.recorder;
    this.playing = false;
    this.label = options.label;
}

Trigger.prototype = {
    init: function() {
        this.container = document.createElement('div');
        this.display = document.createElement('div');
        this.keyCodeContainer = document.createElement('h3');
        this.startButton = document.createElement('button');
        this.stopButton = document.createElement('button');
        this.labelContainer = document.createElement('h3');

        this.display.innerHTML = 'No sample';
        this.keyCodeContainer.innerHTML = String.fromCharCode(this.keyCode);

        this.startButton.innerHTML = 'record';
        this.startButton.addEventListener('click', function() {
            this.startRecording();
        }.bind(this));

        this.stopButton.innerHTML = 'stop';
        this.stopButton.disabled = true;
        this.stopButton.addEventListener('click', function() {
            this.stopRecording();
        }.bind(this));

        this.labelContainer.innerHTML = this.label;

        this.container.appendChild(this.display);
        this.container.appendChild(this.keyCodeContainer);
        this.container.appendChild(this.startButton);
        this.container.appendChild(this.stopButton);
        this.container.appendChild(this.labelContainer);

        this.container.className = 'trigger';
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
        this.display.innerHTML = 'Loading Sample';

        console.log('Stopped recording.');

        this.recorder.getBuffer(function(buffer) {
            this.buffer = getAudioBufferFromData(2, buffer);
            this.display.innerHTML = 'Sample Loaded';
        }.bind(this));

        this.recorder.clear();
    },
    startSource: function() {
        if(this.playing || !this.buffer) {
            return;
        }
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(audioContext.destination);
        this.source.start(0);
        this.playing = true;
        this.container.classList.add('playing');
    },
    stopSource: function() {
        if(!this.playing) {
            return;
        }
        this.source.stop();
        this.playing = false;
        this.container.classList.remove('playing');
    }
};

function getAudioBufferFromData(channels, data) {
    var frameCount = data[0].length,
        myArrayBuffer = audioContext.createBuffer(channels, frameCount, audioContext.sampleRate),
        channel,
        nowBuffering;

    for (channel = 0; channel < channels; channel++) {
        nowBuffering = myArrayBuffer.getChannelData(channel);
        for (var i = 0; i < frameCount; i++) {
            nowBuffering[i] = data[channel][i];
        }
    }

    return myArrayBuffer;
}
