export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Forward the request to your backend
    const response = await fetch(`${backendUrl}/job-applications`, {
      method: 'POST',
      body: formData,
    });

    return new Response(JSON.stringify(await response.json()), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}