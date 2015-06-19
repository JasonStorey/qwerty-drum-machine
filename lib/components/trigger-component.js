var events = require('events'),
    keyboardInput = require('./../keyboard-input.js');

function TriggerComponent(trigger, parent) {
    this.trigger = trigger;
    this.parent = parent;

    this.emitter = new events.EventEmitter();

    this.container = document.createElement('div');
    this.sampleDisplay = document.createElement('input');
    this.keyCodeContainer = document.createElement('div');
    this.labelContainer = document.createElement('input');

    this.container.className = 'trigger';

    this.container.addEventListener('click', function(event) {
        event.stopPropagation();
        this.emitter.emit('trigger-component-clicked', this);
    }.bind(this));

    this.sampleDisplay.type = 'text';
    this.sampleDisplay.value = 'no sample';
    this.sampleDisplay.className = 'sample-display';
    this.sampleDisplay.disabled = true;

    var self = this;
    function sampleNameUpdateHandler() {
        self.emitter.emit('trigger-sample-display-updated', self.sampleDisplay.value);
        self.sampleDisplay.blur();
    }

    this.sampleDisplay.addEventListener('focusin', function(event) {
        event.stopPropagation();
        keyboardInput.disableTriggers();
        keyboardInput.once('keydown_13', sampleNameUpdateHandler);
    }.bind(this));

    this.sampleDisplay.addEventListener('focusout', function(event) {
        event.stopPropagation();
        keyboardInput.enableTriggers();
        keyboardInput.removeListener('keydown_13', sampleNameUpdateHandler);
        this.update();
    }.bind(this));

    this.keyCodeContainer.innerHTML = String.fromCharCode(this.trigger.keyCode);
    this.keyCodeContainer.className = 'key-code-container';

    this.labelContainer.className = 'label-container';
    this.labelContainer.type = 'text';
    this.labelContainer.value = this.trigger.label;

    function labelUpdateHandler() {
        self.emitter.emit('trigger-label-updated', self.labelContainer.value);
        self.labelContainer.blur();
    }

    this.labelContainer.addEventListener('focusin', function(event) {
        event.stopPropagation();
        keyboardInput.disableTriggers();
        keyboardInput.once('keydown_13', labelUpdateHandler);
    }.bind(this));

    this.labelContainer.addEventListener('focusout', function(event) {
        event.stopPropagation();
        keyboardInput.enableTriggers();
        keyboardInput.removeListener('keydown_13', labelUpdateHandler);
        this.update();
    }.bind(this));

    this.update();

    this.container.appendChild(this.sampleDisplay);
    this.container.appendChild(this.keyCodeContainer);
    this.container.appendChild(this.labelContainer);
}

TriggerComponent.prototype = {
    update: function() {
        if(this.trigger.buffer) {
            this.sampleDisplay.value = this.trigger.buffer.name;
            this.sampleDisplay.disabled = false;
        } else {
            this.sampleDisplay.disabled = true;
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

        this.labelContainer.value = this.trigger.label;
    },
    draw: function() {
        this.parent.appendChild(this.container);
    }
};

module.exports = TriggerComponent;
