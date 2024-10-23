"use client";
import Image from "next/image";
import React, { useRef } from "react";
import CollapseMenu from "./components/CollapseMenu";
import Chat from "./components/Chat";
import QuestionCard from "./components/QuestionCard";

// Types
interface Conversation {
  role: string;
  content: string;
  img_url?: string;
}

type OptionType =
  | "Historical Analysis"
  | "Predictive Analysis"
  | "Descriptive Analysis"
  | "Diagnostic Analysis"
  | "Prescriptive Analysis"
  | "Other";

interface SampleQuestion {
  type: OptionType[];
  question: string;
}

const sampleQuestions: SampleQuestion[] = [
  {
    type: ["Historical Analysis"],
    question: "What was average temperature in March 2023?",
  },
  {
    type: ["Descriptive Analysis"],
    question:
      "Which room in GlobalDWS have the highest temperature in April 2024?",
  },
  {
    type: ["Diagnostic Analysis"],
    question:
      "Why CTO Room - Stationary has the highest temperature in the April 2024?",
  },
  {
    type: ["Predictive Analysis"],
    question:
      "Give me 15 days temperature forecast analysis based on historical data.",
  },
];

export default function Home() {
  // States
  const [value, setValue] = React.useState<string>("");
  const [mode, setMode] = React.useState<number>(0); //0: text mode, 1: voice mode
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // use this to reset the conversation instead of refreshing the page
  const [isServiceConnected, setIsServiceConnected] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const silenceThreshold = 8000;

  // Handlers
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Add user message to conversation
      const chatHistory = [
        ...conversation,
        { role: "user", content: value },
        { role: "assistant", content: "" },
      ];

      setValue("");
      setConversation([...chatHistory]);

      console.log("test question front", value);

      const response = await fetch("/api/aichatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // question: chatHistory,
          question: value,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (response.body) {
        let result = "";
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { done, value } = (await reader?.read()) as {
            done: boolean;
            value: Uint8Array;
          }; // ts type assertion
          if (done) break;
          result += decoder.decode(value, { stream: true });

          setConversation((prev) =>
            prev.map((item, index) => {
              if (item.role === "assistant" && index === prev.length - 1) {
                return { ...item, content: result };
              }
              return item;
            })
          );
        }
      }

      // const data = await response.json();

      // // Add response to conversation
      // setConversation((prev) =>
      //   prev.map((item, index) => {
      //     if (item.role === "assistant" && index === prev.length - 1) {
      //       if (data?.data?.data?.output === undefined) {
      //         return {
      //           ...item,
      //           content: data?.data?.data,
      //           img_url: data?.data?.plot_url,
      //         };
      //       }
      //       return { ...item, content: data.data.data.output };
      //     }
      //     return item;
      //   })
      // );
    }
  };

  const handleSend = async () => {
    // Add user message to conversation
    const chatHistory = [
      ...conversation,
      { role: "user", content: value },
      { role: "assistant", content: "" },
    ];

    setValue("");
    setConversation([...chatHistory]);

    console.log("test question front", value);

    const response = await fetch("/api/aichatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // question: chatHistory,
        question: value,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.body) {
      let result = "";
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = (await reader?.read()) as {
          done: boolean;
          value: Uint8Array;
        }; // ts type assertion
        if (done) break;
        result += decoder.decode(value, { stream: true });

        setConversation((prev) =>
          prev.map((item, index) => {
            if (item.role === "assistant" && index === prev.length - 1) {
              return { ...item, content: result };
            }
            return item;
          })
        );
      }
    }
  };

  // Handle quick question access
  const handleQuickQuestion = async (question: string) => {
    console.log("Test quick question", question);
    setValue(question);
  };

  // Handle reset conversation
  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  };

  // Fetch assistant welcome message
  const fetchAudioStream = async () => {
    const response = await fetch("/api/voicebot");

    if (!response.ok) {
      console.error("Error fetching audio stream");
      return;
    }

    // Create a blobURL from the response for audio playback
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the welcome message
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
  };

  // Start listening for stream audio
  const startListening = async () => {
    try {
      // Get audio stream from the microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Create a media recorder
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      let lastChunkTime = Date.now();

      // Event listeners:
      // - ondataavailable: Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
        lastChunkTime = Date.now();
      };

      // - onstop: When the media recorder stops, send the audio to the server
      mediaRecorder.onstop = async () => {
        if (!audioChunks.length) return; // No data to process

        setIsProcessing((prev) => true); // Set flag to prevent new recordings

        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        const reader = new FileReader();

        // When the audio is fully read, send it to the server
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string)?.split(",")[1];
          try {
            const response = await fetch("/api/voicebot", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                audio: base64Audio,
                type: "audio/mpeg",
              }),
            });

            if (!response.ok) {
              console.error("Error fetching audio stream");
              setIsProcessing((prev) => false);
              return;
            }

            // Play the response transcription
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
              audioRef.current.src = audioUrl;
              audioRef.current
                .play()
                .catch((error) => console.error("Error playing audio:", error));
            }
            // Wait until the response is done playing before restarting
            const handleEnded = () => {
              setIsProcessing((prev) => false); // Reset flag when playback is done
              startListening(); // Restart listening
            };

            console.log("Transcription Result");
            //Remove any existing event listeners to avoid duplication
            if (audioRef.current) {
              audioRef.current.removeEventListener("ended", handleEnded);
              audioRef.current.addEventListener("ended", handleEnded, {
                once: true,
              });
            }
          } catch (error) {
            console.error("Error transcribing audio:", error);
          }
        };

        // Read the audio blob as a data URL
        reader.readAsDataURL(audioBlob);
      };

      const checkSilence = () => {
        if (Date.now() - lastChunkTime >= silenceThreshold) {
          mediaRecorder.stop();
          setIsListening(false);
        } else {
          setTimeout(checkSilence, 1000); // Check every second
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      checkSilence();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Handle: toogle voice service connection
  React.useEffect(() => {
    if (mode) {
      const connectToService = async () => {
        const response = await fetch("/api/connection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: mode,
          }),
        });

        if (!response.ok) {
          setIsServiceConnected(false);
          throw new Error(`Services are not connected. ${response.statusText}`);
        } else {
          setIsServiceConnected(true);
        }
      };

      connectToService();
    }
  }, [mode]);

  // Handle: voice listening
  React.useEffect(() => {
    if (isServiceConnected) {
      fetchAudioStream().then(() => {
        setIsStreaming(false); // Stop streaming once the welcome message is done
        setIsListening(true); // Start listening after the welcome message
        startListening();
      });
    } else {
      setIsStreaming(false); // Stop streaming once the welcome message is done
    }

    return () => {
      // Cleanup code if needed
    };
  }, [isServiceConnected]);

  return (
    <main className="w-full flex h-full flex-col items-center justify-between overflow-hidden p-10">
      <div className="w-full bg-[url('/bg-overlay.png')] bg-cover bg-center h-screen absolute top-0 left-0 -z-10"></div>
      {/* Layout */}
      <div className="w-full h-screen grid md:grid-cols-12 gap-2 relative z-10">
        {/* Left-side panel*/}
        <div className="col-span-3 bg-[#092a4d] p-10 rounded-md">
          {/*New Chat */}
          <div
            className="flex items-center justify-start gap-4 w-full cursor-pointer hover:text-aquaTurquoise text-white"
            onClick={handleRefresh}
          >
            {/* Edit icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#0098C1"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>

            <div>New Conversation</div>
          </div>
          {/* Section: Database Connection */}
          <div>
            <CollapseMenu />
          </div>

          {/* Other Configuration */}
          <div className="flex items-center flex-col justify-start gap-4 w-full text-white mt-7">
            <div className="self-start w-full text-left font-medium">
              Settings
            </div>

            {/* Sub-menu */}
            <div className="w-full text-sm flex flex-col  justify-start gap-4 pl-3">
              {/* Chat mode toggle */}
              <div className="flex items-center justify-start gap-1 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#0098C1"
                >
                  <path d="M240-520h60v-80h-60v80Zm100 80h60v-240h-60v240Zm110 80h60v-400h-60v400Zm110-80h60v-240h-60v240Zm100-80h60v-80h-60v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                </svg>
                <div className="form-control">
                  <label className="cursor-pointer label gap-2">
                    <span className=" text-white">Voice Mode</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-accent toggle-sm"
                      checked={mode ? true : false}
                      onChange={(e) => setMode(e.target.checked ? 1 : 0)}
                    />
                  </label>
                </div>
              </div>

              {/* Knowledge Base */}
              <div className="flex items-center justify-start gap-1 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#0098C1"
                >
                  <path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-54 80h80l6-50q8-3 14.5-7t11.5-9l46 20 40-68-40-30q2-8 2-16t-2-16l40-30-40-68-46 20q-5-5-11.5-9t-14.5-7l-6-50h-80l-6 50q-8 3-14.5 7t-11.5 9l-46-20-40 68 40 30q-2 8-2 16t2 16l-40 30 40 68 46-20q5 5 11.5 9t14.5 7l6 50Zm40-100q-25 0-42.5-17.5T420-520q0-25 17.5-42.5T480-580q25 0 42.5 17.5T540-520q0 25-17.5 42.5T480-460Z" />
                </svg>
                <div className="form-control">
                  <label className="cursor-pointer label gap-2">
                    <span className="text-white">Knowledge Base</span>
                  </label>
                </div>
              </div>

              {/* Standard */}
              <div className="flex items-center justify-start gap-1 w-full">
                <Image
                  src="/icon-standard.png"
                  alt="standard"
                  width={18}
                  height={18}
                />
                <div className="form-control">
                  <label className="cursor-pointer label gap-2">
                    <span className=" text-white">Standards</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        {mode === 0 ? (
          <>
            {/* Main Chat */}
            <div className="flex flex-col justify-between items-center col-span-9">
              {/* Section: Welcome Hero */}
              {conversation && conversation.length === 0 ? (
                // If no conversation, display logo hero and guiding question cards
                <div className="w-full flex flex-col justify-center items-center my-0 gap-3">
                  <img
                    className="relative"
                    src="/Logo-AI-v4.png"
                    alt="My Chatbot"
                    width={250}
                    height={250}
                  />

                  <div className="flex p-10 gap-5 ">
                    {sampleQuestions.map((item, index) => {
                      return (
                        <QuestionCard
                          key={index}
                          item={item as any}
                          handleQuickQuestion={handleQuickQuestion}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="textarea d-flex w-full max-w-4xl bg-inherit max-h-[700px] overflow-auto mb-2">
                  {conversation.map((item, index) => {
                    return <Chat key={index} item={item} />;
                  })}
                </div>
              )}

              {/* Section: Chat */}
              <div className="w-full flex flex-col items-center justify-center text-white">
                {/* User input */}
                <div className="relative flex justify-center items-center w-full max-w-4xl">
                  <input
                    placeholder="Ask me anything about your database"
                    className="w-full max-w-4xl input border-white bg-transparent"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />

                  {/* Send Button */}
                  <Image
                    className="absolute cursor-pointer right-0 hover:opacity-80"
                    src="/icon-send.png"
                    alt="btn-send"
                    width={50}
                    height={50}
                    priority
                    onClick={handleSend}
                  />
                </div>
              </div>
            </div>
          </>
        ) : mode === 1 && isServiceConnected ? (
          <>
            <div className="flex flex-col items-center col-span-9 text-white">
              {/* <AudioStreamPlayer text="Hello there how can I help you"/> */}
              <h1>Chat with Voice bot</h1>
              <audio ref={audioRef} autoPlay></audio>
              {isStreaming && <p>Streaming audio...</p>}
              {isListening && !isStreaming && <p>Listening...</p>}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center col-span-9 text-white">
              {/* <AudioStreamPlayer text="Hello there how can I help you"/> */}
              <h1>Connecting to Analytic Services</h1>
            </div>
          </>
        )}

        {/* Right-side panel */}
        {/* <div className="col-span-2">
        
        </div> */}
      </div>
    </main>
  );
}
