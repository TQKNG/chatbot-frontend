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

      // Add response to conversation
      setConversation((prev) =>
        prev.map((item, index) => {
          if (item.role === "assistant" && index === prev.length - 1) {
            if (data?.data?.data?.output === undefined) {
              return {
                ...item,
                content: data?.data?.data,
                img_url: data?.data?.plot_url,
              };
            }
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

    const data = await response?.json();
    // console.log("tesssssss", data.data.data);

    setConversation((prev) =>
      prev.map((item, index) => {
        if (item.role === "assistant" && index === prev.length - 1) {
          return { ...item, content: data.data.data?.output };
        }
        return item;
      })
    );
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

  return (
    <main className="w-full flex max-h-screen flex-col items-center justify-between overflow-hidden p-10 bg-black">
      {/* Layout */}
      <div className="w-full h-screen grid md:grid-cols-12 gap-2">
        {/* Left-side panel*/}
        <div className="col-span-3 bg-secondary p-10 rounded-md">
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
              stroke="currentColor"
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
        </div>

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
                      item={item}
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
                className="w-full max-w-4xl input border-md bg-secondary"
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

        {/* Right-side panel */}
        {/* <div className="col-span-3"></div> */}
      </div>
    </main>
  );
}
