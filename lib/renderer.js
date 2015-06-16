var TriggerComponent = require('./components/trigger-component.js'),
    AudioBufferCacheComponent = require('./components/audio-buffer-cache-component.js'),
    AudioBufferRecorderComponent = require('./components/audio-buffer-recorder-component.js'),
    AudioBufferTrimmerComponent = require('./components/audio-buffer-trimmer-component.js');

module.exports = {
    getTriggerComponent: function(trigger, parent) {
        return new TriggerComponent(trigger, parent);
    },
    createAudioBufferCacheComponent: function(audioBufferCache, parent) {
        return new AudioBufferCacheComponent(audioBufferCache, parent);
    },
    createAudioBufferRecorderComponent: function(audioBufferRecorder, parent) {
        return new AudioBufferRecorderComponent(audioBufferRecorder, parent);
    },
    getAudioBufferTrimmerComponent: function(audioBufferTrimmer, parent) {
        return new AudioBufferTrimmerComponent(audioBufferTrimmer, parent);
    }
};
