var renderer = require('./../renderer.js'),
    events = require('events');

function AudioBufferTrimmer(options) {
    this.emitter = new events.EventEmitter();

    this.enabled = options.enabled || false;
    this.start = options.start || 0;
    this.duration = options.duration || 10;
    this.end = options.end || this.duration;
    this.component = renderer.getAudioBufferTrimmerComponent(this, options.container);
}

AudioBufferTrimmer.prototype = {
    init: function() {
        this.component.emitter.on('start-slider-update', function(start) {
            this.emitter.emit('buffer-trimmer-updated', {start:start, end:this.end});
        }.bind(this));

        this.component.emitter.on('end-slider-update', function(end) {
            this.emitter.emit('buffer-trimmer-updated', {start:this.start, end:end});
        }.bind(this));

        this.component.draw();
    },
    update: function(options) {
        this.enabled = options.enabled || false;
        this.start = options.start || 0;
        this.duration = options.duration || 10;
        this.end = options.end || this.duration;

        this.component.update();
    }
};

module.exports = AudioBufferTrimmer;
