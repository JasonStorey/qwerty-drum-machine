var audioUtils = require('./audio-utils.js');

function AudioBufferCache() {
    this.buffers = [];
}

AudioBufferCache.prototype = {
    addBufferFromData: function(data, name) {
        var bufferNode = audioUtils.getAudioBufferFromData(2, data);
        var buffer = {
            index: this.buffers.length,
            name: name || 'Sample #' + this.buffers.length,
            bufferNode: bufferNode
        };

        this.buffers.push(buffer);

        if(this.updateListener) {
            this.updateListener(this);
        }

        return buffer;
    },
    getBufferByIndex: function(index) {
        return this.buffers[index];
    },
    getBuffers: function() {
        return this.buffers;
    },
    onUpdate: function(cb) {
        this.updateListener = cb;
    }
};

module.exports = AudioBufferCache;
