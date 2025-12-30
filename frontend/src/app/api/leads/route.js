import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      return NextResponse.json(
        { message: 'Name, email, and phone are required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB using the existing connection
    const { connection } = await connectToDatabase();
    
    // Insert the lead into the database
    const result = await connection.db.collection('leads').insertOne({
      ...formData,
      status: 'new',
      source: formData.source || 'website-contact-form',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Lead saved successfully',
        leadId: result.insertedId 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to save lead. Please try again.' 
      },
      { status: 500 }
    );
  }
}
