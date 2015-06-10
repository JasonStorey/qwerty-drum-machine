var audioUtils = require('./audio-utils.js'),
    events = require('events'),
    renderer = require('./renderer.js');

function AudioBufferCache() {
    this.buffers = [];
    this.emitter = new events.EventEmitter();
    this.component = renderer.createAudioBufferCacheComponent(this, document.body);

    this.selectedBufferIndex = 0;
}

AudioBufferCache.prototype = {
    init: function() {
        this.component.draw();
    },
    addBufferFromData: function(data, name) {
        var bufferNode = audioUtils.getAudioBufferFromData(2, data);
        var buffer = {
            index: this.buffers.length,
            name: name || 'Sample #' + this.buffers.length,
            bufferNode: bufferNode
        };

        this.buffers.push(buffer);
        this.emitter.emit('buffer-added', buffer);

        this.component.update();
        return buffer;
    },
    getBufferByIndex: function(index) {
        return this.buffers[index];
    },
    getBuffers: function() {
        return this.buffers;
    },
    setSelectedBufferIndex: function(bufferIndex) {
        this.selectedBufferIndex = bufferIndex;
        this.component.update();
    },
    getSelectedBuffer: function() {
        return this.getBufferByIndex(this.selectedBufferIndex);
    }
};

module.exports = AudioBufferCache;
