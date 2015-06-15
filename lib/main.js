var Trigger = require('./trigger.js'),
    AudioBufferCache = require('./audio-buffer-cache.js'),
    AudioBufferRecorder = require('./audio-buffer-recorder.js'),
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
        audioBufferCache = new AudioBufferCache(),
        audioBufferRecorder = new AudioBufferRecorder(recorder),
        selectedTrigger;

    audioBufferRecorder.emitter.on('buffer-recorded', function(bufferNode) {
        var buffer = audioBufferCache.addBuffer(bufferNode);
        if(selectedTrigger) {
            selectedTrigger.updateBuffer(buffer);
            audioBufferCache.setSelectedBufferIndex(selectedTrigger.buffer.index);
        }
    });

    audioBufferCache.emitter.on('buffer-selected', function(buffer) {
        if(selectedTrigger) {
            selectedTrigger.updateBuffer(buffer);
        }
    });

    audioBufferCache.init();
    audioBufferRecorder.init();

    for(var i = 0; i < KEY_CODES.length; i++) {
        triggers.push(new Trigger({
            keyCode: KEY_CODES[i],
            recorder: recorder,
            label: 'Trigger #' + i,
            audioBufferCache: audioBufferCache
        }));

        triggers[i].emitter.on('trigger-selected', function(newSelectedTrigger) {
            var selectedBufferIndex = newSelectedTrigger.buffer ? newSelectedTrigger.buffer.index : -1;
            selectedTrigger = newSelectedTrigger;
            audioBufferCache.setSelectedBufferIndex(selectedBufferIndex);
            triggers.forEach(function(trigger) {
                if(trigger !== selectedTrigger) {
                    trigger.setSelected(false);
                }
            });
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
