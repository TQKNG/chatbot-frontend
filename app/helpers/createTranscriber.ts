import { RealtimeTranscriber, RealtimeTranscript } from "assemblyai";
import { Dispatch, SetStateAction } from "react";
import { getAssemblyToken } from "./getAssemblyToken";

export async function createTranscriber(
    setTranscribedText: Dispatch<SetStateAction<string>>
  ): Promise<RealtimeTranscriber | undefined> {
    const token = await getAssemblyToken();
    if (!token) {
      console.error('No token found');
      return;
    }
    const transcriber = new RealtimeTranscriber({
      sampleRate: 16_000,
      token: token,
      endUtteranceSilenceThreshold: 1000,
    });
    transcriber.on('transcript', (transcript: RealtimeTranscript) => {
      if (!transcript.text) {
        return;
      }
  
      if (transcript.message_type === 'PartialTranscript') {
        setTranscribedText(transcript.text);
      } else { // Final transcript
        setTranscribedText(transcript.text);
      }
    });
  
    return transcriber;
  }
  