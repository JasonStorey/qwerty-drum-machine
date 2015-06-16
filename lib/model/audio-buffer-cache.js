var events = require('events'),
    renderer = require('./../renderer.js');

function AudioBufferCache(options) {
    this.buffers = [];
    this.emitter = new events.EventEmitter();
    this.selectedBufferIndex = -1;
    this.component = renderer.createAudioBufferCacheComponent(this, options.container);
}

AudioBufferCache.prototype = {
    init: function() {
        this.component.draw();
        this.component.emitter.on('buffer-select-change', function(bufferIndex) {
            this.setSelectedBufferIndex(bufferIndex);
        }.bind(this));
    },
    addBuffer: function(bufferNode) {
        var buffer = {
            index: this.buffers.length,
            name: 'Sample #' + this.buffers.length,
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
        if(this.selectedBufferIndex === bufferIndex) {
            return;
        }
        this.selectedBufferIndex = bufferIndex;
        this.emitter.emit('buffer-selected', this.getBufferByIndex(this.selectedBufferIndex));
        this.component.update();
    }
};

module.exports = AudioBufferCache;
