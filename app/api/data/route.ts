// app/api/data/route.ts
// Next.js 15 Route Handler - podstawowy przykład

import { NextRequest, NextResponse } from 'next/server';

// GET handler
export async function GET(request: NextRequest) {
  try {
    // Pobierz parametry z URL
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Buduj URL do zewnętrznego API
    let apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    if (userId) {
      apiUrl += `?userId=${userId}`;
    }

    // Pobierz dane z zewnętrznego API
    const response = await fetch(apiUrl, {
      // Next.js 15 domyślnie nie cache'uje, ale możesz to kontrolować
      next: { revalidate: 60 } // Rewalidacja co 60 sekund
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Zwróć odpowiedź
    return NextResponse.json(
      {
        success: true,
        data: data,
        count: data.length
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    );

  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Nie udało się pobrać danych',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    // Pobierz dane z body
    const body = await request.json();
    const { title, content, userId } = body;

    // Walidacja
    if (!title || !content || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Brakuje wymaganych pól: title, content, userId'
        },
        { status: 400 }
      );
    }

    // Wyślij dane do zewnętrznego API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body: content,
        userId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: data,
        message: 'Post utworzony pomyślnie'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Błąd POST:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}