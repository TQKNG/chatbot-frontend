export const dynamic= 'force-dynamic'
export async function POST(req:Request){
    const body  = await req.json();

    console.log("test question", body)

    const res = await fetch("http://localhost:8000/api/v1/askagent", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            question:body.question
        })
    })

    
    const data = await res.json()

    
    return Response.json({data});
}