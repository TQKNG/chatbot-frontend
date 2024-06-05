export const dynamic= 'force-dynamic'
export async function GET(req:Request){
    const res = Response.json({message:'Hello World'})

    return res;
}