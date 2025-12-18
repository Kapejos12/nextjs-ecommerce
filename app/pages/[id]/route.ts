// app/api/posts/[id]/route.ts
// Next.js 15 Dynamic Route Handler - obsługa parametrów URL

import { NextRequest, NextResponse } from 'next/server';

// Typ dla parametrów
type RouteParams = {
  params: {
    id: string;
  };
};

// GET - pobierz pojedynczy post
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // Walidacja ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID' },
        { status: 400 }
      );
    }

    // Pobierz post z zewnętrznego API
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        next: { revalidate: 300 } // Cache na 5 minut
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Post nie został znaleziony' },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: post
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Błąd GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - aktualizuj post
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Walidacja
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID' },
        { status: 400 }
      );
    }

    const { title, body: content } = body;

    if (!title && !content) {
      return NextResponse.json(
        { error: 'Brak danych do aktualizacji' },
        { status: 400 }
      );
    }

    // Aktualizuj post
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Number(id),
          title,
          body: content,
          userId: 1
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPost = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: updatedPost,
        message: 'Post zaktualizowany pomyślnie'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Błąd PUT:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH - częściowa aktualizacja
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPost = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: updatedPost,
        message: 'Post częściowo zaktualizowany'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Błąd PATCH:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - usuń post
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Nieprawidłowe ID' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Post ${id} usunięty pomyślnie`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Błąd DELETE:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Opcjonalnie: generowanie statycznych parametrów dla Static Generation
// export async function generateStaticParams() {
//   const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
//     .then(res => res.json());
//   
//   return posts.slice(0, 10).map((post: any) => ({
//     id: post.id.toString(),
//   }));
// }