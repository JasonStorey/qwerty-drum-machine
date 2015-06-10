var audioUtils = require('./audio-utils.js'),
    renderer = require('./renderer.js');

function Trigger(options) {
    this.keyCode = options.keyCode;
    this.recorder = options.recorder;
    this.audioBufferCache = options.audioBufferCache;
    this.playing = false;
    this.recording = false;
    this.label = options.label;
    this.sampleStart = 0;

    this.component = renderer.getTriggerComponent(this, document.body);
}

Trigger.prototype = {
    init: function() {
        this.component.emitter.on('sample-select', function(selectedIndex) {
            this.updateBuffer(this.audioBufferCache.getBufferByIndex(selectedIndex));
        }.bind(this));

        this.component.emitter.on('record-start', function() {
            this.startRecording();
        }.bind(this));

        this.component.emitter.on('record-stop', function() {
            this.stopRecording();
        }.bind(this));

        this.component.emitter.on('start-slider-update', function(start) {
            this.sampleStart = start;
        }.bind(this));
    },
    update: function() {
        this.component.update();
    },
    draw: function() {
        this.component.draw();
    },
    startRecording: function() {
        this.recording = true;

        this.recorder.record();
        this.component.update();
    },
    stopRecording: function() {
        this.recording = false;
        this.recorder.stop();
        this.recorder.getBuffer(function(data) {
            this.updateBuffer(this.audioBufferCache.addBufferFromData(data));
        }.bind(this));

        this.recorder.clear();
        this.component.update();
    },
    startSource: function() {
        if(this.playing || !this.buffer) {
            return;
        }
        this.source = audioUtils.getAudioContext().createBufferSource();
        this.source.buffer = this.buffer.bufferNode;
        this.source.connect(audioUtils.getAudioContext().destination);
        this.source.start(0, this.sampleStart);
        this.playing = true;
        this.component.update();
    },
    stopSource: function() {
        if(!this.playing) {
            return;
        }
        this.source.stop();
        this.playing = false;
        this.component.update();
    },
    updateBuffer: function(buffer) {
        this.buffer = buffer;
        this.component.update();
    }
};

module.exports = Trigger;
