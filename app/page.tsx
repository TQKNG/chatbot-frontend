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

      const data = await response.json();
      console.log("tesssssss", data);

      setValue("");
      setConversation([
        ...chatHistory,
        { role: "assistant", content: data.data.data.output },
      ]);
    }
  };

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      {/* Section: Welcome Hero */}
      <div className="">
        <div className="">
          <Image
            className="relative"
            src="/chatbot.png"
            alt="My Chatbot"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>

      {/* Conversation */}
      <div className="textarea d-flex w-full max-w-4xl  max-h-[400px] overflow-auto mb-">
        {conversation.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className="chat chat-end">
                  <div className="chat-bubble max-w-[400px]">
                    <strong className="badge bg-aquaTurquoise text-black">Bot</strong>
                    <div className="flex w-100 align-center justify-start">
                      {item?.content}
                    </div>
                  </div>
                  <br />
                </div>
              ) : (
                <div className="chat chat-start">
                  <div className="chat-bubble bg-aquaTurquoise text-black max-w-[400px]">
                    <strong className="badge ">User</strong>
                    <br />
                    {item?.content}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Section: Chat */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* User input */}
        <input
          placeholder="Ask me anything about your database"
          className="w-full max-w-4xl input input-bordered border-aquaTurquoise"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary btn-xl my-6"
          onClick={handleRefresh}
        >
          Start new conversation
        </button>
      </div>
    </main>
  );
}
