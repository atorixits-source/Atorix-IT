import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${apiUrl}/api/hiring-leads`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch hiring leads');
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : (data.data || []));
  } catch (error) {
    console.error('Error in hiring-leads API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch hiring leads',
        error: error.message
      },
      { status: 500 }
    );
  }
}