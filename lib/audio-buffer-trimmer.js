var renderer = require('./renderer.js'),
    events = require('events');

function AudioBufferTrimmer(options) {
    this.component = renderer.getAudioBufferTrimmerComponent(this, document.body);
    this.emitter = new events.EventEmitter();

    this.enabled = options.enabled || false;
    this.start = options.start || 0;
    this.duration = options.duration || 10;
}

AudioBufferTrimmer.prototype = {
    init: function() {
        this.component.emitter.on('start-slider-update', function(start) {
            this.emitter.emit('start-updated', start);
        }.bind(this));

        this.component.draw();
    },
    update: function(options) {
        this.enabled = options.enabled || false;
        this.start = options.start || 0;
        this.duration = options.duration || 10;

        this.component.update();
    }
};

module.exports = AudioBufferTrimmer;
