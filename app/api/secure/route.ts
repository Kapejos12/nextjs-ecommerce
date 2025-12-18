// app/api/secure/route.ts
// Next.js 15 Route Handler z autoryzacją i zmiennymi środowiskowymi

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Funkcja pomocnicza do weryfikacji API key
function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.INTERNAL_API_KEY;
  
  return apiKey === validApiKey;
}

// GET handler z autoryzacją
export async function GET(request: NextRequest) {
  // Weryfikacja API key (opcjonalnie)
  // if (!verifyApiKey(request)) {
  //   return NextResponse.json(
  //     { error: 'Unauthorized' },
  //     { status: 401 }
  //   );
  // }

  try {
    // Pobierz klucz API ze zmiennych środowiskowych
    const externalApiKey = process.env.EXTERNAL_API_KEY;
    const externalApiUrl = process.env.EXTERNAL_API_URL || 'https://api.example.com/data';

    // Sprawdź czy klucz istnieje
    if (!externalApiKey) {
      throw new Error('Brak konfiguracji API key');
    }

    // Wywołanie zewnętrznego API z autoryzacją
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${externalApiKey}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache na 5 minut
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    // Zwróć dane z odpowiednimi headerami
    return NextResponse.json(
      {
        success: true,
        data: data
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=300',
          'X-Content-Type-Options': 'nosniff',
        }
      }
    );

  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Nie udało się pobrać danych z zewnętrznego API',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST handler z walidacją
export async function POST(request: NextRequest) {
  try {
    // Pobierz dane z body
    const body = await request.json();
    
    // Walidacja schematu danych
    const { data, userId } = body;
    
    if (!data || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brakuje wymaganych pól' 
        },
        { status: 400 }
      );
    }

    const externalApiKey = process.env.EXTERNAL_API_KEY;
    const externalApiUrl = process.env.EXTERNAL_API_URL || 'https://api.example.com/data';

    // Wyślij dane do zewnętrznego API
    const response = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${externalApiKey}`,
      },
      body: JSON.stringify({
        data,
        userId,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: 'Dane wysłane pomyślnie'
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

// Opcjonalnie: DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Brak ID do usunięcia' },
        { status: 400 }
      );
    }

    const externalApiKey = process.env.EXTERNAL_API_KEY;
    const externalApiUrl = `${process.env.EXTERNAL_API_URL}/${id}`;

    const response = await fetch(externalApiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${externalApiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Element ${id} usunięty pomyślnie`
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