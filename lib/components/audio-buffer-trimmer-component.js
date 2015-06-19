var events = require('events');

function AudioBufferTrimmerComponent(audioBufferTrimmer, parent) {
    this.audioBufferTrimmer = audioBufferTrimmer;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.startSlider = document.createElement('input');
    this.startLabel = document.createElement('label');
    this.endSlider = document.createElement('input');
    this.endLabel = document.createElement('label');

    this.container.className = 'audio-buffer-trimmer';

    this.startSlider.id = 'startInput';
    this.startSlider.disabled = true;
    this.startSlider.type = 'range';
    this.startSlider.min = 0;
    this.startSlider.max = this.audioBufferTrimmer.duration;
    this.startSlider.step = 0.01;
    this.startSlider.value = this.audioBufferTrimmer.start;
    this.startSlider.addEventListener('change', function(event) {
        this.emitter.emit('start-slider-update', event.target.value);
    }.bind(this));

    this.endSlider.id = 'endInput';
    this.endSlider.disabled = true;
    this.endSlider.type = 'range';
    this.endSlider.min = 0;
    this.endSlider.max = this.audioBufferTrimmer.duration;
    this.endSlider.step = 0.01;
    this.endSlider.value = this.audioBufferTrimmer.end;
    this.endSlider.addEventListener('change', function(event) {
        this.emitter.emit('end-slider-update', event.target.value);
    }.bind(this));

    this.startLabel.setAttribute('for', this.startSlider.id);
    this.startLabel.innerHTML = 'start';
    this.endLabel.setAttribute('for', this.endSlider.id);
    this.endLabel.innerHTML = 'end';

    this.container.appendChild(this.startLabel);
    this.container.appendChild(this.startSlider);
    this.container.appendChild(this.endLabel);
    this.container.appendChild(this.endSlider);
}

AudioBufferTrimmerComponent.prototype = {
    update: function() {
        this.startSlider.disabled = !this.audioBufferTrimmer.enabled;
        this.startSlider.max = this.audioBufferTrimmer.duration;
        this.startSlider.value = this.audioBufferTrimmer.start;

        this.endSlider.disabled = !this.audioBufferTrimmer.enabled;
        this.endSlider.max = this.audioBufferTrimmer.duration;
        this.endSlider.value = this.audioBufferTrimmer.end;
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

module.exports = AudioBufferTrimmerComponent;
