import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {

  const response = await fetch("http://127.0.0.1:8000/api/v1/test-voice",{
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    }
  })

  const responseText = await response.text();

  console.log("test response", responseText)

  return Response.json(response);
}
