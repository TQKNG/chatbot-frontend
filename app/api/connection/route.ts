export async function GET() {

    const response = await fetch("http://127.0.0.1:8000/api/v1/connectagentservice",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
    })

    return new Response(
        JSON.stringify(await response.json()), 
    );
  }
  