var audioUtils = require('./lib/audio-utils.js'),
    QDM = require('./lib/qwerty-drum-machine.js');

var Recorder,
    audioContext,
    triggersContainer,
    controlsContainer;

function audioStreamHandler(stream) {
    var input = audioContext.createMediaStreamSource(stream),
        recorder = new Recorder(input);

    QDM.init({
        recorder: recorder,
        triggersContainer: triggersContainer,
        controlsContainer: controlsContainer
    });
}

module.exports = {
    init: function(options) {
        Recorder = options.recorder;
        audioContext = audioUtils.getAudioContext();
        audioUtils.getAudioStream(audioStreamHandler);
        triggersContainer = options.triggersContainer;
        controlsContainer = options.controlsContainer;
    }
};
