var events = require('events');

function TriggerComponent(trigger, parent) {
    this.trigger = trigger;
    this.parent = parent;

    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.sampleDisplay = document.createElement('div');
    this.keyCodeContainer = document.createElement('div');
    this.labelContainer = document.createElement('div');

    this.container.className = 'trigger';

    this.container.addEventListener('click', function(event) {
        this.emitter.emit('trigger-component-clicked', this);
    }.bind(this));

    this.sampleDisplay.innerHTML = 'no sample';
    this.sampleDisplay.className = 'sample-display';

    this.keyCodeContainer.innerHTML = String.fromCharCode(this.trigger.keyCode);
    this.keyCodeContainer.className = 'key-code-container';

    this.labelContainer.innerHTML = this.trigger.label;
    this.labelContainer.className = 'label-container';

    this.update();

    this.container.appendChild(this.sampleDisplay);
    this.container.appendChild(this.keyCodeContainer);
    this.container.appendChild(this.labelContainer);
}

TriggerComponent.prototype = {
    update: function() {
        if(this.trigger.buffer) {
            this.sampleDisplay.innerHTML = this.trigger.buffer.name;
        }

        if(this.trigger.playing) {
            this.container.classList.add('active');
        } else {
            this.container.classList.remove('active');
        }

        if(this.trigger.selected) {
            this.container.classList.add('selected');
        } else {
            this.container.classList.remove('selected');
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
    this.optionsHeader = new Option('LOAD SAMPLE', -1);

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

function AudioBufferRecorderComponent(audioBufferRecorder, parent) {
    this.audioBufferRecorder = audioBufferRecorder;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.startButton = document.createElement('button');
    this.stopButton = document.createElement('button');

    this.container.className = 'audio-buffer-recorder';

    this.startButton.innerHTML = 'record';
    this.startButton.addEventListener('click', function() {
        this.emitter.emit('record-start');
    }.bind(this));

    this.stopButton.innerHTML = 'stop';
    this.stopButton.disabled = true;
    this.stopButton.addEventListener('click', function() {
        this.emitter.emit('record-stop');
    }.bind(this));

    this.container.appendChild(this.startButton);
    this.container.appendChild(this.stopButton);
}

AudioBufferRecorderComponent.prototype = {
    update: function() {
        if(this.audioBufferRecorder.recording) {
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
        } else {
            this.startButton.disabled = false;
            this.stopButton.disabled = true;
        }
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

function AudioBufferTrimmerComponent(audioBufferTrimmer, parent) {
    this.audioBufferTrimmer = audioBufferTrimmer;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.startSlider = document.createElement('input');

    this.container.className = 'audio-buffer-trimmer';

    this.startSlider.disabled = true;
    this.startSlider.type = 'range';
    this.startSlider.min = 0;
    this.startSlider.max = audioBufferTrimmer.duration;
    this.startSlider.step = 0.01;
    this.startSlider.value = audioBufferTrimmer.start;
    this.startSlider.addEventListener('input', function(event) {
        this.emitter.emit('start-slider-update', event.target.value);
    }.bind(this));

    this.container.appendChild(this.startSlider);
}

AudioBufferTrimmerComponent.prototype = {
    update: function() {
        this.startSlider.disabled = !this.audioBufferTrimmer.enabled;
        this.startSlider.max = this.audioBufferTrimmer.duration;
        this.startSlider.value = this.audioBufferTrimmer.start;
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
    },
    createAudioBufferRecorderComponent: function(audioBufferRecorder, parent) {
        return new AudioBufferRecorderComponent(audioBufferRecorder, parent);
    },
    getAudioBufferTrimmerComponent: function(audioBufferTrimmer, parent) {
        return new AudioBufferTrimmerComponent(audioBufferTrimmer, parent);
    }
};
