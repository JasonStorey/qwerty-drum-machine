var Trigger = require('./model/trigger.js'),
    AudioBufferCache = require('./model/audio-buffer-cache.js'),
    AudioBufferRecorder = require('./model/audio-buffer-recorder.js'),
    AudioBufferTrimmer = require('./model/audio-buffer-trimmer.js'),
    keyboardInput = require('./keyboard-input.js'),
    fileSave = require('./file-save.js');

var triggers = [],
    KEY_CODES = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77],
    selectedTrigger;

var audioBufferCache,
    audioBufferRecorder,
    audioBufferTrimmer;

function init(options) {
    keyboardInput.init();
    keyboardInput.on('keydown_48', saveState);

    audioBufferCache = new AudioBufferCache({ container: options.controlsContainer });

    audioBufferRecorder = new AudioBufferRecorder({
        container: options.controlsContainer,
        recorder: options.recorder
    });

    audioBufferTrimmer = new AudioBufferTrimmer({ container: options.controlsContainer });

    audioBufferRecorder.emitter.on('buffer-recorded', bufferRecordedHandler);
    audioBufferCache.emitter.on('buffer-selected', bufferSelectedHandler);
    audioBufferTrimmer.emitter.on('buffer-trimmer-updated', bufferTrimmerUpdatedHandler);

    audioBufferCache.init();
    audioBufferRecorder.init();
    audioBufferTrimmer.init();

    for(var i = 0; i < KEY_CODES.length; i++) {
        triggers.push(new Trigger({
            keyCode: KEY_CODES[i],
            recorder: options.recorder,
            label: 'trigger #' + i,
            container: options.triggersContainer
        }));

        triggers[i].emitter.on('trigger-selected', triggerSelectedHandler);
        triggers[i].init();
    }

    triggers.forEach(function(trigger) {
        keyboardInput.on('keydown_' + trigger.keyCode, function() {
            trigger.startSource();
        });

        keyboardInput.on('keyup_' + trigger.keyCode, function() {
            trigger.stopSource();
        });
    });
}

function bufferRecordedHandler(stereoAudioData) {
    var buffer = audioBufferCache.addBuffer(stereoAudioData);
    if(selectedTrigger) {
        selectedTrigger.updateBuffer(buffer);
    }
    updateUIComponents();
}

function bufferSelectedHandler(buffer) {
    if(selectedTrigger && selectedTrigger.buffer !== buffer) {
        selectedTrigger.updateBuffer(buffer);
    }
    updateUIComponents();
}

function bufferTrimmerUpdatedHandler(config) {
    if(selectedTrigger) {
        selectedTrigger.setTrim(config.start, config.end);
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
            start: 0,
            duration: 10
        },
        selectedBufferId = selectedTrigger && selectedTrigger.buffer ? selectedTrigger.buffer.id : -1;

    audioBufferCache.setSelectedBufferById(selectedBufferId);

    if(selectedTrigger && selectedTrigger.buffer) {
        trimmerConfig.enabled = true;
        trimmerConfig.start = selectedTrigger.bufferStart;
        trimmerConfig.duration = selectedTrigger.buffer.getDuration();
        trimmerConfig.end = selectedTrigger.bufferEnd;
    }

    audioBufferTrimmer.update(trimmerConfig);
}

function saveState() {
    var state = {
        audioBufferCache: audioBufferCache.getState()
    };

    fileSave.save(state);
}

module.exports = {
    init: init
};
