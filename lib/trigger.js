var audioUtils = require('./audio-utils.js'),
    renderer = require('./renderer.js'),
    events = require('events');

function Trigger(options) {
    this.keyCode = options.keyCode;
    this.recorder = options.recorder;
    this.audioBufferCache = options.audioBufferCache;
    this.emitter = new events.EventEmitter();

    this.playing = false;
    this.recording = false;
    this.label = options.label;
    this.bufferStart = 0;

    this.component = renderer.getTriggerComponent(this, document.body);
}

Trigger.prototype = {
    init: function() {
        this.component.emitter.on('start-slider-update', function(start) {
            this.bufferStart = start;
        }.bind(this));

        this.component.emitter.on('trigger-component-selected', function(triggerComponent) {
            this.emitter.emit('trigger-selected', this);
        }.bind(this));

        this.component.draw();
    },
    startSource: function() {
        if(this.playing || !this.buffer) {
            return;
        }
        this.source = audioUtils.getAudioContext().createBufferSource();
        this.source.buffer = this.buffer.bufferNode;
        this.source.connect(audioUtils.getAudioContext().destination);
        this.source.start(0, this.bufferStart);
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
