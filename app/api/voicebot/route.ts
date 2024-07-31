import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";


// Text-to-speech API
export async function GET() {

  const response = await fetch("http://127.0.0.1:8000/api/v1/test-voice",{
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    }
  })

  const stream = new ReadableStream({
    async start(controller){
      const reader = response.body?.getReader();

      if(!reader){
        throw new Error("Failed to get reader from response body")
      }

      const decoder = new TextDecoder();
      let done = false;

      while(!done){
        const{value, done:readerDone} = await reader.read();
        done  = readerDone;

        if(value){
          controller.enqueue(value);
        }
      }
      controller.close();
    }
  })


  return new Response(stream, {
    headers: {
      "Content-Type": "audio/mpeg", // Use the appropriate MIME type for your audio
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}

// Speech-to-text API
export async function POST(req:Request, res:Response){
  const body = req.body;

  console.log("Request Body:", body);

  const response = await fetch("http://127.0.0.1:8000/api/v1/test-voice",{
    method:"POST",
    body: body
  })

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log("Server Response:", data);

}