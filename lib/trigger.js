var audioUtils = require('./audio-utils.js');

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
        this.source = audioUtils.getAudioContext().createBufferSource();
        this.source.buffer = this.buffer.bufferNode;
        this.source.connect(audioUtils.getAudioContext().destination);
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

module.exports = Trigger;
