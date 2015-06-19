var events = require('events');

function AudioBufferCacheComponent(audioBufferCache, parent) {
    this.audioBufferCache = audioBufferCache;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.dropDown = document.createElement('select');
    this.optionsHeader = new Option('select sample', -1);
    this.container.className = 'audio-buffer-cache';

    this.dropDown.addEventListener('change', function(event) {
        var selectedBufferId = event.target.options[event.target.selectedIndex].value;
        if(selectedBufferId === 0) {
            return;
        }
        this.emitter.emit('buffer-select-change', selectedBufferId);
    }.bind(this));

    this.dropDown.disabled = true;

    this.optionsHeader.disabled = true;
    this.optionsHeader.selected = true;

    this.dropDown.appendChild(this.optionsHeader);
    this.container.appendChild(this.dropDown);
}

AudioBufferCacheComponent.prototype = {
    update: function() {
        var buffers = this.audioBufferCache.getBuffers();

        while (this.dropDown.hasChildNodes()) {
            this.dropDown.removeChild(this.dropDown.lastChild);
        }

        this.dropDown.disabled = true;
        this.dropDown.appendChild(this.optionsHeader);

        buffers.forEach(function(buffer, index) {
            this.dropDown.appendChild(new Option(buffer.name, buffer.id));
            this.dropDown.disabled = false;
        }.bind(this));

        this.dropDown.selectedIndex = parseInt(this.audioBufferCache.selectedBufferId, 10) + 1;
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

module.exports = AudioBufferCacheComponent;
