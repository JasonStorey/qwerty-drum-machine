var Trigger = require('./trigger.js'),
    AudioBufferCache = require('./audio-buffer-cache.js'),
    AudioBufferRecorder = require('./audio-buffer-recorder.js'),
    AudioBufferTrimmer = require('./audio-buffer-trimmer.js'),
    audioUtils = require('./audio-utils.js');

var Recorder,
    audioContext;

function startUserMedia(stream) {
    var input = audioContext.createMediaStreamSource(stream);
    console.log('Media stream created.');
    var recorder = new Recorder(input);
    console.log('Recorder initialised.');
    initQDM(recorder);
}

function initQDM(recorder) {
    var triggers = [],
        KEY_CODES = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77],
        audioBufferCache = new AudioBufferCache({
            container: document.body
        }),
        audioBufferRecorder = new AudioBufferRecorder({
            container: document.body,
            recorder: recorder
        }),
        audioBufferTrimmer = new AudioBufferTrimmer({
            container: document.body
        }),
        selectedTrigger;

    audioBufferRecorder.emitter.on('buffer-recorded', bufferRecordedHandler);
    audioBufferCache.emitter.on('buffer-selected', bufferSelectedHandler);
    audioBufferTrimmer.emitter.on('start-updated', bufferStartUpdatedHandler);

    audioBufferCache.init();
    audioBufferRecorder.init();
    audioBufferTrimmer.init();

    for(var i = 0; i < KEY_CODES.length; i++) {
        triggers.push(new Trigger({
            keyCode: KEY_CODES[i],
            recorder: recorder,
            label: 'Trigger #' + i,
            audioBufferCache: audioBufferCache,
            container: document.body
        }));

        triggers[i].emitter.on('trigger-selected', triggerSelectedHandler);
        triggers[i].init();
    }

    function bufferRecordedHandler(bufferNode) {
        var buffer = audioBufferCache.addBuffer(bufferNode);
        if(selectedTrigger) {
            selectedTrigger.updateBuffer(buffer);
        }
        updateUIComponents();
    }

    function bufferSelectedHandler(buffer) {
        if(selectedTrigger) {
            selectedTrigger.updateBuffer(buffer);
        }
        updateUIComponents();
    }

    function bufferStartUpdatedHandler(start) {
        if(selectedTrigger) {
            selectedTrigger.setStart(start);
        }
        updateUIComponents();
    }

    function triggerSelectedHandler(newSelectedTrigger) {
        selectedTrigger = newSelectedTrigger;

        triggers.forEach(function(trigger) {
            if(trigger !== selectedTrigger) {
                trigger.setSelected(false);
            }
        });

        updateUIComponents();
    }

    function updateUIComponents() {
        var trimmerConfig = {
                enabled: false,
                start: 5,
                duration: 10
            },
            selectedBufferIndex = selectedTrigger && selectedTrigger.buffer ? selectedTrigger.buffer.index : -1;

        audioBufferCache.setSelectedBufferIndex(selectedBufferIndex);

        if(selectedTrigger && selectedTrigger.buffer) {
            trimmerConfig.enabled = true;
            trimmerConfig.start = selectedTrigger.bufferStart;
            trimmerConfig.duration = selectedTrigger.buffer.bufferNode.duration;
        }

        audioBufferTrimmer.update(trimmerConfig);
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
