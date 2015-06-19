var events = require('events');

function AudioBufferWrapper(config) {
    this.bufferNode = config.bufferNode;
    this.name = config.name;
    this.id = config.id;

    this.emitter = new events.EventEmitter();
}

AudioBufferWrapper.prototype = {
    update: function(config) {
        this.bufferNode = config.bufferNode || this.bufferNode;
        this.name = config.name || this.name;
        this.id = config.id || this.id;

        this.emitter.emit('buffer-updated', this);
    },
    getDuration: function() {
        return this.bufferNode.duration;
    }
};

module.exports = AudioBufferWrapper;
