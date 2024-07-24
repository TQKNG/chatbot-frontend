import { NextResponse } from "next/server";
export const dynamic= 'force-dynamic'


export async function POST(req:Request, res:Response){
    const body  = await req.json();
    let response = null;

    console.log("test question", body)

    /*
    Production API service
    https://intelligenceservice.azurewebsites.net/api/v1/askagent


    Development API service
    http://127.0.0.1:8000/api/v1/asksqlagent

    */

     // Set headers for Server-Sent Events
   
    response = await fetch("http://127.0.0.1:8000/api/v1/asksqlagent", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                question:body.question
            })
    })
    
    // const data = await res?.json()
    // console.log("test response", data)


    // test readable stream
    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder();
            // controller.enqueue(encoder.encode('data: start agent\n\n'));
            controller.enqueue(encoder.encode(`data: ${await response.text()}\n\n`));

            // Simulate streaming data
            setTimeout(() => {
                controller.enqueue(encoder.encode(`data: ${response.text()}\n\n`));
                controller.close();
            }, 2000);
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })



    // const stream = response.body?.pipeTo(new WritableStream({
    //     write(chunk){
    //         const reader = new TextDecoder('utf-8')
    //         const data = reader.decode(chunk)
    //         let results;
    //         if (data.includes("sql-db-query-checker")) {
    //             results = 'initialize'
    //         }
    //         else results = data

    //     },
    //     close(){
    //         console.log("Stream closed")
    //     },
    //     abort(){
    //         console.log("Stream aborted")
    //     }
    // }))
    
}