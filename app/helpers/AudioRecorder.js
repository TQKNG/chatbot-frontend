import React, { useState, useEffect } from 'react';

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in your browser');
      return;
    }

    // Create a new instance of SpeechRecognition
    const recognition = new (window).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Event listener for speech results
    recognition.onresult = (event) => {
      let newTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript;
      }
      setTranscript(newTranscript);
      console.log('Transcript:', newTranscript);
    };

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };



    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    // Start recognition when the component mounts
    recognition.start();

    // Cleanup on component unmount
    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <div className="text-white">
      <h1>Speech to Text</h1>
      <p>Status: {isListening ? 'Listening...' : 'Not Listening'}</p>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechToText;
