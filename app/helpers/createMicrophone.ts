import { mergeBuffers } from "./mergeBuffers";


export function createMicrophone(stream: MediaStream){
    let audioWorkletNode;
    let audioContext: AudioContext;
    let source:any;
    let audioBufferQueue = new Int16Array(0);

    return{
        async startRecording(onAudioCallback:any){
            audioContext = new AudioContext({
                sampleRate:16000,
                latencyHint: 'balanced'
            })
            source: audioContext.createMediaStreamSource(stream);

            await audioContext.audioWorklet.addModule('./record-processor.js');
            audioWorkletNode = new AudioWorkletNode(audioContext,'audio-processor');

            source.connect(audioWorkletNode);
            audioWorkletNode.connect(audioContext.destination);

            audioWorkletNode.port.onmessage = (event)=>{
                const currentBuffer = new Int16Array(event.data.audio_data);
                audioBufferQueue = mergeBuffers(audioBufferQueue, currentBuffer);

                const bufferDuration = (audioBufferQueue.length /audioContext.sampleRate)*1000;

                // Wait till having 100ms of audio data
                if(bufferDuration > 100){
                    const totalSamples = Math.floor(audioContext.sampleRate * 0.1);

                    const finalBuffer = new Uint8Array(audioBufferQueue.subarray(0, totalSamples).buffer);

                    audioBufferQueue = audioBufferQueue.subarray(totalSamples);
                    if (onAudioCallback) onAudioCallback(finalBuffer);
                }
            }
        }
    }
}