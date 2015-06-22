var audioContext;

module.exports = {
    getAudioContext: function() {
        if(audioContext) {
            return audioContext;
        }
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

            audioContext = new AudioContext;

            return audioContext;
        } catch (e) {
            alert('No web audio support in this browser!');
        }
    },
    getAudioStream: function(streamHandler) {
        navigator.getUserMedia({audio: true}, streamHandler, function(e) {
            console.log('No live audio input: ' + e);
        });
    },
    getAudioBufferNodeFromData: function(buffers) {
        var frameCount = buffers[0].length,
            bufferNode = this.getAudioContext().createBuffer(2, frameCount, audioContext.sampleRate);

        bufferNode.getChannelData(0).set(buffers[0]);
        bufferNode.getChannelData(1).set(buffers[1]);

        return bufferNode;
    }
};
