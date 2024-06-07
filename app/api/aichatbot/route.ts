export const dynamic= 'force-dynamic'
export async function POST(req:Request){
    const body  = await req.json();

    console.log("test question", body)

    const res = await fetch("http://localhost:8080/api/langchainassistant", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            question:body.question
        })
    })

    
    const data = await res.json()

    console.log("tesssssss", data);
    
    return Response.json({data});
}