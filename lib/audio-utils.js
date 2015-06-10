var audioContext;

module.exports = {
    getAudioContext: function() {
        if(audioContext) {
            return audioContext;
        }
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
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
    getAudioBufferFromData: function(channels, data) {
        var frameCount = data[0].length,
            myArrayBuffer = this.getAudioContext().createBuffer(channels, frameCount, audioContext.sampleRate),
            channel,
            nowBuffering;

        for (channel = 0; channel < channels; channel++) {
            nowBuffering = myArrayBuffer.getChannelData(channel);
            for (var i = 0; i < frameCount; i++) {
                nowBuffering[i] = data[channel][i];
            }
        }

        return myArrayBuffer;
    }
};
