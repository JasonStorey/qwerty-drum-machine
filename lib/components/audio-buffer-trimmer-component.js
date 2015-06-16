var events = require('events');

function AudioBufferTrimmerComponent(audioBufferTrimmer, parent) {
    this.audioBufferTrimmer = audioBufferTrimmer;
    this.parent = parent;
    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.startSlider = document.createElement('input');
    this.label = document.createElement('label');

    this.container.className = 'audio-buffer-trimmer';

    this.startSlider.id = 'startInput';
    this.startSlider.disabled = true;
    this.startSlider.type = 'range';
    this.startSlider.min = 0;
    this.startSlider.max = this.audioBufferTrimmer.duration;
    this.startSlider.step = 0.01;
    this.startSlider.value = this.audioBufferTrimmer.start;
    this.startSlider.addEventListener('input', function(event) {
        this.emitter.emit('start-slider-update', event.target.value);
    }.bind(this));

    this.label.setAttribute('for', this.startSlider.id);
    this.label.innerHTML = 'start';
    this.container.appendChild(this.label);
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

module.exports = AudioBufferTrimmerComponent;
