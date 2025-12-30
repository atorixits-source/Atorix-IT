import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.company || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the request to the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atorix-backend-server.onrender.com'}/api/demo-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to submit demo request' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: 'Demo request submitted successfully'
    });

  } catch (error) {
    console.error('Error in demo request API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atorix-backend-server.onrender.com'}/api/demo-requests`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch demo requests' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || [],
      count: data.count || 0
    });

  } catch (error) {
    console.error('Error fetching demo requests:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
