"use client";
import Image from "next/image";
import React, { useRef } from "react";

// Types
interface Conversation {
  role: string;
  content: string;
}

export default function Home() {
  // States
  const [value, setValue] = React.useState<string>("");
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null); // use this to reset the conversation instead of refreshing the page

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
      const chatHistory = [...conversation, { role: "user", content: value }];

      // Response from AI Assistant service (API)
      console.log("test question front", value)
      const response = await fetch("/api/aichatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // question: chatHistory,
          question: "what is the average temperature",
        }),
      });

      const data = await response.json();
      console.log("Final resttt", data.data.finalRes);

      setValue("");
      setConversation([
        ...chatHistory,
        { role: "assistant", content: data.data.finalRes },
      ]);
    }
  };

  const handleRefresh = ()=>{
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Section: Welcome Hero */}
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="My Chatbot"
          width={180}
          height={37}
          priority
        />
      </div>

      {/* Section: Chat */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* Label */}
        <p>Please type your question</p>
        {/* User input */}
        <input
          placeholder="Type here"
          className="w-full max-w-2xl input input-bordered input-secondary"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary btn-xl my-6">Start new conversation</button>
        {/* Conversation */}
        <div className="textarea">
          {conversation.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <br />
                {item.role === "assistant" ? (
                  <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-secondary">
                      <strong className="badge badge-primary">Bot</strong>
                    </div>
                    <br />
                    {item?.content}
                  </div>
                ) : (
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">
                      <strong className="badge badge-primary">User</strong>
                      <br />
                      {item?.content}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </main>
  );
}
