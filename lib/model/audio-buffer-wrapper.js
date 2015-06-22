var events = require('events'),
    audioUtils = require('./../audio-utils.js');

function AudioBufferWrapper(config) {
    this.name = config.name;
    this.id = config.id;
    this.rawData = config.rawData;

    this.bufferNode = audioUtils.getAudioBufferNodeFromData(config.rawData);
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
    },
    getState: function() {
        return {
            name: this.name,
            id: this.id,
            rawData: this.rawData
        };
    }
};

module.exports = AudioBufferWrapper;
