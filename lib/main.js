var Trigger = require('./trigger.js'),
    AudioBufferCache = require('./audio-buffer-cache.js'),
    audioUtils = require('./audio-utils.js');

var Recorder,
    audioContext;

function startUserMedia(stream) {
    var input = audioContext.createMediaStreamSource(stream);
    console.log('Media stream created.');
    //input.connect(audioContext.destination);

    var recorder = new Recorder(input);
    console.log('Recorder initialised.');
    initQDM(recorder);
}

function initQDM(recorder) {
    var triggers = [],
        KEY_CODES = [65, 83, 68, 70, 71, 72, 74, 75, 76],
        audioBufferCache = new AudioBufferCache();

    audioBufferCache.emitter.on('selected-trigger-updated', function(buffer) {

    });

    audioBufferCache.init();

    for(var i = 0; i < KEY_CODES.length; i++) {
        triggers.push(new Trigger({
            keyCode: KEY_CODES[i],
            recorder: recorder,
            label: 'Trigger #' + i,
            audioBufferCache: audioBufferCache
        }));

        triggers[i].emitter.on('trigger-selected', function(trigger) {
            if(trigger.buffer) {
                audioBufferCache.setTrigger(trigger);
            }
        });

        triggers[i].init();
    }

    window.addEventListener('keydown', checkKeyPressed, false);
    window.addEventListener('keyup', checkKeyReleased, false);

    function checkKeyPressed(e) {
        triggers.forEach(function(trigger) {
            if (e.keyCode == trigger.keyCode) {
                trigger.startSource();
            }
        });
    }

    function checkKeyReleased(e) {
        triggers.forEach(function(trigger) {
            if (e.keyCode == trigger.keyCode) {
                trigger.stopSource();
            }
        });
    }
}

module.exports = {
    init: function(RecorderConstructor) {
        Recorder = RecorderConstructor;
        audioContext = audioUtils.getAudioContext();
        audioUtils.getAudioStream(startUserMedia);
    }
};
