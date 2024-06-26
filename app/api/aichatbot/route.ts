export const dynamic= 'force-dynamic'
export async function POST(req:Request){
    const body  = await req.json();
    let res = null;

    console.log("test question", body)

    /*
    Production API service
    https://intelligenceservice.azurewebsites.net/api/v1/askagent


    Development API service
    http://127.0.0.1:8000/api/v1/asksqlagent

    */
    if(body.question.toLowerCase().includes("analysis")){
       res = await fetch("http://127.0.0.1:8000/api/v1/askdataanalysisagent", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                question:body.question
            })
        })
    }
    else{
        res = await fetch("http://127.0.0.1:8000/api/v1/asksqlagent", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                question:body.question
            })
        })
    }
    
    const data = await res?.json()
    console.log("test response", data)

    
    return Response.json({data});
}