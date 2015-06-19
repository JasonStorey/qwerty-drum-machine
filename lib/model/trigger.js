var audioUtils = require('./../audio-utils.js'),
    renderer = require('./../renderer.js'),
    events = require('events');

function Trigger(options) {
    this.keyCode = options.keyCode;
    this.recorder = options.recorder;
    this.emitter = new events.EventEmitter();

    this.playing = false;
    this.recording = false;
    this.label = options.label;
    this.bufferStart = 0;
    this.selected = false;
    this.active = false;

    this.component = renderer.getTriggerComponent(this, options.container);

    var self = this;
    this._boundBufferUpdateHandler = function() {
        // This flippin' sucks. Make better.
        self.component.update();
    }
}

Trigger.prototype = {
    init: function() {
        this.component.emitter.on('trigger-component-clicked', function(triggerComponent) {
            this.setSelected(true);
        }.bind(this));

        this.component.emitter.on('trigger-sample-display-updated', function(sampleName) {
            this.buffer.update({
                name: sampleName
            });
        }.bind(this));

        this.component.emitter.on('trigger-label-updated', function(labelName) {
            this.label = labelName;
        }.bind(this));

        this.component.draw();
    },
    startSource: function() {
        this.active = true;

        if(!this.playing && this.buffer) {
            this.source = audioUtils.getAudioContext().createBufferSource();
            this.source.buffer = this.buffer.bufferNode;
            this.source.connect(audioUtils.getAudioContext().destination);
            this.source.start(0, this.bufferStart, this.bufferEnd);
            this.playing = true;
        }

        this.component.update();
    },
    stopSource: function() {
        this.active = false;

        if(this.playing) {
            this.source.stop();
            this.playing = false;
        }

        this.component.update();
    },
    updateBuffer: function(buffer) {
        if(this.buffer) {
            this.buffer.emitter.removeListener('buffer-updated', this._boundBufferUpdateHandler);
        }
        this.buffer = buffer;
        this.buffer.emitter.on('buffer-updated', this._boundBufferUpdateHandler);

        this.bufferStart = 0;
        this.bufferEnd = this.buffer.getDuration();
        this.component.update();
    },
    setSelected: function(selected) {
        this.selected = selected;
        if(this.selected) {
            this.emitter.emit('trigger-selected', this);
        }
        this.component.update();
    },
    setStart: function(start) {
        this.bufferStart = start;
    },
    setTrim: function(start, end) {
        this.bufferStart = start;
        this.bufferEnd = end;
    }
};

module.exports = Trigger;
