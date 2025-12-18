// proxy.ts
// Next.js 16 Proxy - zastępuje middleware.ts (nowa konwencja)

import { NextRequest, NextResponse } from 'next/server';

// Rate limiter w pamięci (w produkcji użyj Upstash Redis lub Vercel KV)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Funkcja do pobierania IP klienta
function getClientIp(request: NextRequest): string {
  // Next.js 16 - IP jest dostępne przez headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  // x-forwarded-for może zawierać wiele IP oddzielonych przecinkami
  // Pierwsze IP to rzeczywisty klient
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback dla lokalnego developmentu
  return 'unknown';
}

// Sprawdź rate limit
function checkRateLimit(
  key: string, 
  limit: number = 100, 
  windowMs: number = 60000
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const userLimit = rateLimit.get(key);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset lub nowy użytkownik
    rateLimit.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (userLimit.count >= limit) {
    return { 
      allowed: false, 
      remaining: 0, 
      reset: userLimit.resetTime 
    };
  }

  // Zwiększ licznik
  userLimit.count++;
  return { 
    allowed: true, 
    remaining: limit - userLimit.count, 
    reset: userLimit.resetTime 
  };
}

// Cleanup starych wpisów
function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
}

// Uruchom cleanup co 5 minut
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting dla API routes
  if (pathname.startsWith('/api/')) {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip, 100, 60000); // 100 requestów na minutę

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too Many Requests',
          message: 'Przekroczono limit zapytań. Spróbuj ponownie za chwilę.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(rateLimitResult.reset / 1000))
          }
        }
      );
    }
  }

  // Autoryzacja dla chronionych endpointów
  if (pathname.startsWith('/api/secure')) {
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.INTERNAL_API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'Nieprawidłowy lub brakujący klucz API'
        },
        { status: 401 }
      );
    }
  }

  // CORS headers dla API
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Pobierz dozwolone origins ze zmiennych środowiskowych
    const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
    
    // Dodaj CORS headers
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 godziny
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 204, 
        headers: response.headers 
      });
    }
    
    return response;
  }

  return NextResponse.next();
}

// Konfiguracja proxy - określ które ścieżki mają być przetwarzane
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
  ],
};