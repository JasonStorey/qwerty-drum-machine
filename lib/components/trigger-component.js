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

        if(this.trigger.active) {
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

module.exports = TriggerComponent;
