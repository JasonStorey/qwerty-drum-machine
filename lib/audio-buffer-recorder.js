var audioUtils = require('./audio-utils.js'),
    renderer = require('./renderer.js'),
    events = require('events');

function AudioBufferRecorder(recorder) {
    this.recorder = recorder;
    this.emitter = new events.EventEmitter();

    this.recording = false;

    this.component = renderer.createAudioBufferRecorderComponent(this, document.body);
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
            this.emitter.emit('buffer-recorded', audioUtils.getAudioBufferFromData(2, data));
        }.bind(this));

        this.recorder.clear();
        this.component.update();
    }
};

module.exports = AudioBufferRecorder;
