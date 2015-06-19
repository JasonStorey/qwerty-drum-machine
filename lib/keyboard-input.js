var events = require('events');
var emitter = new events.EventEmitter();

module.exports = {
    init: function() {
        window.addEventListener('keydown', function(e) {
            emitter.emit('keydown_' + e.keyCode);
        }, false);
        window.addEventListener('keyup', function(e) {
            emitter.emit('keyup_' + e.keyCode);
        }, false);
    },
    on: function(eventName, handler) {
        emitter.on(eventName, handler);
    }
};
