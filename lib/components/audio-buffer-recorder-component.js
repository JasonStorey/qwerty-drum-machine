var events = require('events');

function AudioBufferRecorderComponent(audioBufferRecorder, parent) {
    this.audioBufferRecorder = audioBufferRecorder;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.startButton = document.createElement('button');
    this.stopButton = document.createElement('button');

    this.container.className = 'audio-buffer-recorder';

    this.startButton.innerHTML = 'record';
    this.startButton.addEventListener('click', function() {
        this.emitter.emit('record-start');
    }.bind(this));

    this.stopButton.innerHTML = 'stop';
    this.stopButton.disabled = true;
    this.stopButton.addEventListener('click', function() {
        this.emitter.emit('record-stop');
    }.bind(this));

    this.container.appendChild(this.startButton);
    this.container.appendChild(this.stopButton);
}

AudioBufferRecorderComponent.prototype = {
    update: function() {
        if(this.audioBufferRecorder.recording) {
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
        } else {
            this.startButton.disabled = false;
            this.stopButton.disabled = true;
        }
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

module.exports = AudioBufferRecorderComponent;
