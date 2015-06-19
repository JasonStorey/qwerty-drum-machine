var audioUtils = require('./../audio-utils.js'),
    renderer = require('./../renderer.js'),
    events = require('events');

function AudioBufferRecorder(options) {
    this.recorder = options.recorder;
    this.emitter = new events.EventEmitter();

    this.recording = false;

    this.component = renderer.createAudioBufferRecorderComponent(this, options.container);
}

AudioBufferRecorder.prototype = {
    init: function() {
        this.component.emitter.on('record-start', function() {
            this.startRecording();
        }.bind(this));

        this.component.emitter.on('record-stop', function() {
            this.stopRecording();
        }.bind(this));

        this.component.draw();
    },
    startRecording: function() {
        this.recorder.record();
        this.recording = true;
        this.component.update();
    },
    stopRecording: function() {
        this.recorder.stop();
        this.recording = false;
        this.recorder.getBuffer(function(data) {
            var bufferNode = audioUtils.getAudioBufferNodeFromData(2, data);
            this.emitter.emit('buffer-node-recorded', bufferNode);
        }.bind(this));

        this.recorder.clear();
        this.component.update();
    }
};

module.exports = AudioBufferRecorder;
