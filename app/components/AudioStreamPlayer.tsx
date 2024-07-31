import React, { useEffect, useRef } from "react";

interface AudioStreamPlayerProps {
  text: string;
}

export const AudioStreamPlayer: React.FC<AudioStreamPlayerProps> = ({ text }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/voicestream");
    const audioContext = new window.AudioContext();
    const source = audioContext.createBufferSource();
    const bufferQueue: AudioBuffer[] = [];

    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      ws.send(text);
    };

    ws.onmessage = async (event) => {
      const arrayBuffer = event.data;
      if (arrayBuffer) {
        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          bufferQueue.push(audioBuffer);

          if (!source.buffer) {
            const buffer = bufferQueue.shift();
            if (buffer) {
              source.buffer = buffer;
              source.connect(audioContext.destination);
              source.start();
            }
          }
        } catch (e) {
          console.error("Error decoding audio data:", e);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [text]);

  return (
    <div>
      <h1>Real-Time Audio Streaming</h1>
      <audio ref={audioRef} controls autoPlay />
    </div>
  );
};
