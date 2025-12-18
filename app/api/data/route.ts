// app/api/data/route.ts
// Next.js 15 Route Handler - podstawowy przykład

import { NextRequest, NextResponse } from 'next/server';

// GET handler
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

// POST handler
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
      message: `Created/Updated item ${id}`,
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}