var events = require('events');
var emitter = new events.EventEmitter();

var disableTriggers = false;

module.exports = {
    init: function() {
        window.addEventListener('keydown', function(e) {
            if(disableTriggers && e.keyCode !== 13) {
                return;
            }
            emitter.emit('keydown_' + e.keyCode);
        }, false);

        window.addEventListener('keyup', function(e) {
            if(disableTriggers && e.keyCode !== 13) {
                return;
            }
            emitter.emit('keyup_' + e.keyCode);
        }, false);
    },
    disableTriggers: function() {
        disableTriggers = true;
    },
    enableTriggers: function() {
        disableTriggers = false;
    },
    on: function(eventName, handler) {
        emitter.on(eventName, handler);
    },
    once: function(eventName, handler) {
        emitter.once(eventName, handler);
    },
    removeListener: function(eventName, handler) {
        emitter.removeListener(eventName, handler);
    }
};
