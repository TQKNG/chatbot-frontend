
export async function POST(request: Request) {
  


  const body = await request.json();



  const response = {
    response: "Test AI response",
  };

  return Response.json(response);
}
