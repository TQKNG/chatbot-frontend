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


    response.body?.pipeTo(new WritableStream({
        write(chunk){
            console.log(chunk)
            Response.json({data:chunk})

        },
        close(){
            console.log("Stream closed")
        },
        abort(){
            console.log("Stream aborted")
        }
    }))
    
}