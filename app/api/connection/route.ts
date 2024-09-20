export async function POST() {

    // const response = await fetch("http://127.0.0.1:8000/api/v1/connectagentservice",{
    //   method:"POST",
    //   headers:{
    //     "Content-Type":"application/json"
    //   }
    // })

    const response = await fetch("https://intelligenceservice.azurewebsites.net/api/v1/connectagentservice",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      }
    })


    return new Response(
        JSON.stringify(await response.json()), 
    );
  }
  