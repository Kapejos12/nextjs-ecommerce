// app/pages/[id]/route.ts
// Route handler with Next.js 15+ Promise-based params

import { NextRequest, NextResponse } from 'next/server';

// Next.js 15+ requires params to be awaited
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;

    // Your logic here
    // Example: Fetch data based on id
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// If you have other methods (POST, PUT, DELETE), they also need Promise params
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Your POST logic here

    return NextResponse.json({
      success: true,
      message: `Updated item ${id}`,
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}