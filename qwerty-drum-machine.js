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
        KEY_CODES = [65, 83, 68, 70, 71, 72, 74, 75, 76],
        audioBufferCache = new AudioBufferCache();

    audioBufferCache.onUpdate(function() {
        triggers.forEach(function(trigger) {
            trigger.update();
        });
    });

    for(var i = 0; i < KEY_CODES.length; i++) {
        triggers.push(new Trigger({
            keyCode: KEY_CODES[i],
            recorder: recorder,
            label: 'Trigger #' + i,
            audioBufferCache: audioBufferCache
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
    this.audioBufferCache = options.audioBufferCache;
    this.playing = false;
    this.label = options.label;
}

Trigger.prototype = {
    init: function() {
        this.container = document.createElement('div');
        this.dropDown = document.createElement('select');
        this.keyCodeContainer = document.createElement('h3');
        this.startButton = document.createElement('button');
        this.stopButton = document.createElement('button');
        this.startSlider = document.createElement('input');
        this.labelContainer = document.createElement('h3');

        this.container.className = 'trigger';

        this.dropDown.addEventListener('change', function(event) {
            var selectedIndex = event.target.selectedIndex;
            this.buffer = this.audioBufferCache.getBufferByIndex(selectedIndex);
            this.update();
        }.bind(this));

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

        this.startSlider.disabled = true;
        this.startSlider.type = 'range';
        this.startSlider.min = 0;
        this.startSlider.max = 10;
        this.startSlider.step = 0.01;
        this.startSlider.value = 0;

        this.labelContainer.innerHTML = this.label;

        this.update();

        this.container.appendChild(this.dropDown);
        this.container.appendChild(this.keyCodeContainer);
        this.container.appendChild(this.startButton);
        this.container.appendChild(this.stopButton);
        this.container.appendChild(this.startSlider);
        this.container.appendChild(this.labelContainer);

    },
    update: function() {
        var buffers = this.audioBufferCache.getBuffers();

        while (this.dropDown.hasChildNodes()) {
            this.dropDown.removeChild(this.dropDown.lastChild);
        }

        buffers.forEach(function(buffer, index) {
            this.dropDown.appendChild(new Option(buffer.name, index));
        }.bind(this));

        if(this.buffer) {
            this.startSlider.disabled = false;
            this.startSlider.max = this.buffer.bufferNode.duration;
            this.dropDown.selectedIndex = this.buffer.index;
        } else {
            this.startSlider.disabled = true;
        }
    },
    draw: function() {
        document.body.appendChild(this.container);
    },
    startRecording: function() {
        this.startButton.disabled = true;
        this.stopButton.disabled = false;

        this.recorder.record();
    },
    stopRecording: function() {
        this.startButton.disabled = false;
        this.stopButton.disabled = true;

        this.recorder.stop();
        this.recorder.getBuffer(function(data) {
            this.buffer = this.audioBufferCache.addBufferFromData(data);
            this.update();
        }.bind(this));

        this.recorder.clear();
    },
    startSource: function() {
        this.container.classList.add('active');
        if(this.playing || !this.buffer) {
            return;
        }
        this.source = audioContext.createBufferSource();
        this.source.buffer = this.buffer.bufferNode;
        this.source.connect(audioContext.destination);
        this.source.start(0, this.startSlider.value);
        this.playing = true;
    },
    stopSource: function() {
        this.container.classList.remove('active');
        if(!this.playing) {
            return;
        }
        this.source.stop();
        this.playing = false;
    }
};

function AudioBufferCache() {
    this.buffers = [];
}

AudioBufferCache.prototype = {
    addBufferFromData: function(data, name) {
        var bufferNode = getAudioBufferFromData(2, data);
        var buffer = {
            index: this.buffers.length,
            name: name || 'Sample #' + this.buffers.length,
            bufferNode: bufferNode
        };

        this.buffers.push(buffer);

        if(this.updateListener) {
            this.updateListener(this);
        }

        return buffer;
    },
    getBufferByIndex: function(index) {
        return this.buffers[index];
    },
    getBuffers: function() {
        return this.buffers;
    },
    onUpdate: function(cb) {
        this.updateListener = cb;
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
