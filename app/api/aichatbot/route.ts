export const dynamic= 'force-dynamic'
export async function POST(req:Request){
    console.log("test question back", req.body)
    const res = await fetch("http://localhost:5000/api/langchainassistant", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            question:"what is the average AQI"
        })
    })
    
    const data = await res.json()
    
    return Response.json({data});
}