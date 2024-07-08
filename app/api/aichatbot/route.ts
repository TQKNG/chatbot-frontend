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
       res = await fetch("https://intelligenceservice.azurewebsites.net/api/v1/askdataanalysisagent", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                question:body.question
            })
        })
    }
    else if(body.question.toLowerCase().includes("why cto")){
        // wait for 4 seconds before returning the response
        await new Promise(resolve => setTimeout(resolve, 4000));

        return Response.json({data:{data:{output:"The CTO has the highest temperature in the April 2024 because the heat system was on for the first 15 days of the month"}}})
    }
    else{
        res = await fetch("https://intelligenceservice.azurewebsites.net/api/v1/asksqlagent", {
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