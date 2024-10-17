export async function GET(req) {
    console.log("API Route Hit"); // Add this to check if the route is being accessed
  
    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  