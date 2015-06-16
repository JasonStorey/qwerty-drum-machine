var events = require('events');

function AudioBufferCacheComponent(audioBufferCache, parent) {
    this.audioBufferCache = audioBufferCache;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.dropDown = document.createElement('select');
    this.optionsHeader = new Option('no sample', -1);

    this.container.className = 'audio-buffer-cache';

    this.dropDown.addEventListener('change', function(event) {
        var selectedBufferIndex = event.target.options[event.target.selectedIndex].value;
        if(selectedBufferIndex === 0) {
            return;
        }
        this.emitter.emit('buffer-select-change', selectedBufferIndex);
    }.bind(this));

    this.optionsHeader.disabled = true;

    this.dropDown.appendChild(this.optionsHeader);
    this.container.appendChild(this.dropDown);
}

AudioBufferCacheComponent.prototype = {
    update: function() {
        var buffers = this.audioBufferCache.getBuffers();

        while (this.dropDown.hasChildNodes()) {
            this.dropDown.removeChild(this.dropDown.lastChild);
        }

        this.dropDown.appendChild(this.optionsHeader);

        buffers.forEach(function(buffer, index) {
            this.dropDown.appendChild(new Option(buffer.name, buffer.index));
        }.bind(this));

        this.dropDown.selectedIndex = parseInt(this.audioBufferCache.selectedBufferIndex, 10) + 1;
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

module.exports = AudioBufferCacheComponent;
