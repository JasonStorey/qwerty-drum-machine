var events = require('events'),
    renderer = require('./../renderer.js'),
    AudioBufferWrapper = require('./audio-buffer-wrapper.js');

function AudioBufferCache(options) {
    this.buffers = [];
    this.emitter = new events.EventEmitter();
    this.selectedBufferId = -1;
    this.component = renderer.createAudioBufferCacheComponent(this, options.container);
}

AudioBufferCache.prototype = {
    init: function() {
        this.component.draw();
        this.component.emitter.on('buffer-select-change', function(bufferId) {
            this.setSelectedBufferById(bufferId);
        }.bind(this));
    },
    addBuffer: function(bufferNode) {
        var buffer = new AudioBufferWrapper({
            id: this.buffers.length,
            bufferNode: bufferNode,
            name: 'Sample #' + this.buffers.length
        });

        buffer.emitter.on('buffer-updated', function() {
            this.component.update();
        }.bind(this));

        this.buffers.push(buffer);
        this.emitter.emit('buffer-added', buffer);

        this.component.update();
        return buffer;
    },
    getBufferById: function(bufferId) {
        return this.buffers[bufferId];
    },
    getBuffers: function() {
        return this.buffers;
    },
    setSelectedBufferById: function(bufferId) {
        if(this.selectedBufferId === bufferId) {
            return;
        }
        this.selectedBufferId = bufferId;
        this.emitter.emit('buffer-selected', this.getBufferById(this.selectedBufferId));
        this.component.update();
    }
};

module.exports = AudioBufferCache;
