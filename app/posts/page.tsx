// app/posts/page.tsx
// Server Component - pobiera dane bezpośrednio po stronie serwera

import { Suspense } from 'react';

// Typ danych
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Funkcja pobierająca dane (Server-side)
async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      // Opcje cache w Next.js 16
      next: { 
        revalidate: 3600 // Rewalidacja co godzinę
      }
    });

    if (!response.ok) {
      throw new Error('Nie udało się pobrać danych');
    }

    return response.json();
  } catch (error) {
    console.error('Błąd podczas pobierania postów:', error);
    throw error;
  }
}

// Komponent wyświetlający posty
async function PostsList() {
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-gray-600">
          Znaleziono <span className="font-bold text-blue-600">{posts.length}</span> postów
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ✨ Dane pobrane po stronie serwera (Server Component)
        </p>
      </div>

      {posts.map((post) => (
        <article 
          key={post.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 flex-1">
              {post.title}
            </h2>
            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              #{post.id}
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            {post.body}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              User {post.userId}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Post ID: {post.id}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

// Loading component
function PostsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Główny komponent strony
export default function PostsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-500 text-white rounded-lg p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Posts - Server Component
          </h1>
        </div>
        <p className="text-gray-600">
          Dane pobierane bezpośrednio po stronie serwera, bez JavaScript po stronie klienta
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Server Component</h3>
            <p className="text-sm text-blue-700">
              Te dane są renderowane po stronie serwera przed wysłaniem HTML do przeglądarki. 
              Doskonałe dla SEO i pierwszego ładowania strony.
            </p>
          </div>
        </div>
      </div>
      
      {/* Posts List z Suspense */}
      <Suspense fallback={<PostsLoading />}>
        <PostsList />
      </Suspense>
    </main>
  );
}

// Metadata dla SEO
export const metadata = {
  title: 'Posts | Server Component',
  description: 'Lista postów pobrana przez Server Component w Next.js 16',
};