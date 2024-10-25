import { NextResponse } from "next/server";
import type { IncomingMessage } from "http";
export const dynamic = "force-dynamic";


export async function POST(req: Request, res: Response) {
  // const body = await req.json();
  const formData = await req.formData()

  const question = formData.get("question")
  const file = formData.get('knowledgeBase')
  let response = null;

  console.log("test question", question)

  /*
    Production API service
    https://intelligenceservice.azurewebsites.net/api/v1/askagent


    Development API service
    http://127.0.0.1:8000/api/v1/asksqlagent

    */

  // Routing agent
  if (typeof question === "string" &&
    (question.includes("analysis") || 
     question.includes("predict") || 
     question.includes("forecast"))
  ) {
 
    response = await fetch("https://intelligenceservice.azurewebsites.net/api/v1/askdataanalysisagentv2", {
      method: "POST",
      body: formData,
    });
  }else{
    console.log("test form data front end", formData)
    response = await fetch(" https://intelligenceservice.azurewebsites.net/api/v1/asksqlagent", {
      method: "POST",
      body: formData,
    });
  
  }
  
  // const data = await res?.json()
  // console.log("test response", data)

  // Read the response body once
  const responseText = await response.text();

  //  readable stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let index = 0;
      const enqueueNextCharacter = () => {
        if (index < responseText.length) {
          // Encode and enqueue the next character
          controller.enqueue(encoder.encode(responseText[index]));
          index++;
          // Schedule the next character to be enqueued
          setTimeout(enqueueNextCharacter, 20); // Adjust the delay as needed
        } else {
          // Close the stream when all characters have been enqueued
          controller.close();
        }
      };
  
      // Start streaming the characters
      enqueueNextCharacter();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
