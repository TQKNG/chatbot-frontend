"use client";
import Image from "next/image";
import React, { ReactEventHandler, useRef } from "react";

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
      const chatHistory = [
        ...conversation,
        { role: "user", content: value },
        { role: "assistant", content: "" },
      ];

      setValue("");
      setConversation([...chatHistory]);

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

      // Add response to conversation
      setConversation((prev) =>
        prev.map((item, index) => {
          if (item.role === "assistant" && index === prev.length - 1) {
            return { ...item, content: data.data.data.output };
          }
          return item;
        })
      );
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

    // Add response to conversation
    setConversation((prev) =>
      prev.map((item, index) => {
        if (item.role === "assistant" && index === prev.length - 1) {
          return { ...item, content: data.data.data.output };
        }
        return item;
      })
    );
  };

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConversation([]);
  };

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-between p-10">
      {/* Edit Button */}
      <div className="w-full">
        <Image
          className="cursor-pointer hover:opacity-80"
          src="/icon-edit.png"
          alt="btn-edit"
          width={100}
          height={100}
          priority
          onClick={handleRefresh}
        />
      </div>
      {/* Section: Welcome Hero */}
      {conversation && conversation.length === 0 ? (
        <div className="w-full flex justify-center items-center my-0">
          <Image
            className="relative"
            src="/logo-v2.png"
            alt="My Chatbot"
            width={250}
            height={250}
            priority
          />
        </div>
      ) : (
        <div className="textarea d-flex w-full max-w-4xl  max-h-[700px] overflow-auto mb-2">
          {conversation.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <br />
                {item.role === "assistant" ? (
                  <div className="chat chat-end">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col chat-bubble max-w-[400px]">
                      <strong className="badge bg-aquaTurquoise text-black">
                        ChatBOK
                      </strong>
                      {item.content === "" ? (
                        <span className="loading loading-dots loading-sm"></span>
                      ) : (
                        <div className="flex w-100 align-center justify-start">
                          {item?.content}
                        </div>
                      )}
                    </div>
                    <br />
                  </div>
                ) : (
                  <div className="chat chat-start">
                      <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        />
                      </div>
                    </div>
                    <div className="chat-bubble bg-aquaTurquoise text-black max-w-[400px]">
                      <strong className="badge ">User</strong>
                      <br />

                      <div>{item?.content}</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Section: Chat */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* User input */}
        <div className="relative flex justify-center items-center w-full max-w-4xl">
          <input
            placeholder="Ask me anything about your database"
            className="w-full max-w-4xl input input-bordered border-aquaTurquoise"
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
    </main>
  );
}
