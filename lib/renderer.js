var events = require('events');

function TriggerComponent(trigger, parent) {
    this.trigger = trigger;
    this.parent = parent;

    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.dropDown = document.createElement('select');
    this.keyCodeContainer = document.createElement('h3');
    this.startButton = document.createElement('button');
    this.stopButton = document.createElement('button');
    this.startSlider = document.createElement('input');
    this.labelContainer = document.createElement('h3');

    this.container.className = 'trigger';

    this.container.addEventListener('click', function(event) {
        this.emitter.emit('trigger-component-selected', this);
    }.bind(this));

    this.dropDown.addEventListener('change', function(event) {
        var selectedIndex = event.target.selectedIndex;
        this.emitter.emit('sample-select', selectedIndex);
    }.bind(this));

    this.keyCodeContainer.innerHTML = String.fromCharCode(this.trigger.keyCode);

    this.startButton.innerHTML = 'record';
    this.startButton.addEventListener('click', function() {
        this.emitter.emit('record-start');
    }.bind(this));

    this.stopButton.innerHTML = 'stop';
    this.stopButton.disabled = true;
    this.stopButton.addEventListener('click', function() {
        this.emitter.emit('record-stop');
    }.bind(this));

    this.startSlider.disabled = true;
    this.startSlider.type = 'range';
    this.startSlider.min = 0;
    this.startSlider.max = 10;
    this.startSlider.step = 0.01;
    this.startSlider.value = this.trigger.bufferStart;
    this.startSlider.addEventListener('input', function(event) {
        this.emitter.emit('start-slider-update', event.target.value);
    }.bind(this));

    this.labelContainer.innerHTML = this.trigger.label;

    this.update();

    this.container.appendChild(this.dropDown);
    this.container.appendChild(this.keyCodeContainer);
    this.container.appendChild(this.startButton);
    this.container.appendChild(this.stopButton);
    this.container.appendChild(this.startSlider);
    this.container.appendChild(this.labelContainer);
}

TriggerComponent.prototype = {
    update: function() {
        var buffers = this.trigger.audioBufferCache.getBuffers();

        while (this.dropDown.hasChildNodes()) {
            this.dropDown.removeChild(this.dropDown.lastChild);
        }

        buffers.forEach(function(buffer, index) {
            this.dropDown.appendChild(new Option(buffer.name, index));
        }.bind(this));

        if(this.trigger.buffer) {
            this.startSlider.disabled = false;
            this.startSlider.max = this.trigger.buffer.bufferNode.duration;
            this.dropDown.selectedIndex = this.trigger.buffer.index;
            this.startSlider.value = this.trigger.bufferStart;
        } else {
            this.startSlider.disabled = true;
        }

        if(this.trigger.recording) {
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
        } else {
            this.startButton.disabled = false;
            this.stopButton.disabled = true;
        }

        if(this.trigger.playing) {
            this.container.classList.add('active');
        } else {
            this.container.classList.remove('active');
        }
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

function AudioBufferCacheComponent(audioBufferCache, parent) {
    this.audioBufferCache = audioBufferCache;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.dropDown = document.createElement('select');

    this.container.className = 'audio-buffer-cache';

    this.dropDown.addEventListener('change', function(event) {
        var selectedIndex = event.target.selectedIndex;
        this.emitter.emit('buffer-select-change', selectedIndex);
    }.bind(this));

    this.container.appendChild(this.dropDown);
}

AudioBufferCacheComponent.prototype = {
    update: function() {
        var buffers = this.audioBufferCache.getBuffers();

        while (this.dropDown.hasChildNodes()) {
            this.dropDown.removeChild(this.dropDown.lastChild);
        }

        buffers.forEach(function(buffer, index) {
            this.dropDown.appendChild(new Option(buffer.name, index));
        }.bind(this));

        this.dropDown.selectedIndex = this.audioBufferCache.selectedBufferIndex;
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

module.exports = {
    getTriggerComponent: function(trigger, parent) {
        return new TriggerComponent(trigger, parent);
    },
    createAudioBufferCacheComponent: function(audioBufferCache, parent) {
        return new AudioBufferCacheComponent(audioBufferCache, parent);
    }
};
