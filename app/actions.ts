// app/actions.ts
'use server';

// NOWOŚĆ React 19: Server Actions
// Funkcje oznaczone 'use server' działają wyłącznie po stronie serwera

import { revalidatePath } from 'next/cache';

// Typ dla formularza
interface FormResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

// Server Action: Utwórz nowy post
export async function createPost(formData: FormData): Promise<FormResult> {
  'use server';

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    // Walidacja
    if (!title || !content) {
      return {
        success: false,
        error: 'Tytuł i treść są wymagane'
      };
    }

    if (title.length < 3) {
      return {
        success: false,
        error: 'Tytuł musi mieć minimum 3 znaki'
      };
    }

    // Symulacja opóźnienia API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Wywołanie zewnętrznego API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body: content,
        userId: 1
      })
    });

    if (!response.ok) {
      throw new Error('Błąd API');
    }

    const data = await response.json();

    // Rewaliduj cache
    revalidatePath('/react19-server-actions');

    return {
      success: true,
      message: `Post "${title}" został utworzony!`,
      data
    };

  } catch (error) {
    console.error('Server Action Error:', error);
    return {
      success: false,
      error: 'Wystąpił błąd podczas tworzenia posta'
    };
  }
}

// Server Action: Usuń post
export async function deletePost(postId: number): Promise<FormResult> {
  'use server';

  try {
    // Symulacja opóźnienia
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Błąd usuwania');
    }

    revalidatePath('/react19-server-actions');

    return {
      success: true,
      message: `Post #${postId} został usunięty`
    };

  } catch (error) {
    return {
      success: false,
      error: 'Nie udało się usunąć posta'
    };
  }
}

// Server Action: Aktualizuj post
export async function updatePost(
  postId: number,
  formData: FormData
): Promise<FormResult> {
  'use server';

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      return {
        success: false,
        error: 'Wszystkie pola są wymagane'
      };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          title,
          body: content,
          userId: 1
        })
      }
    );

    if (!response.ok) {
      throw new Error('Błąd aktualizacji');
    }

    const data = await response.json();

    revalidatePath('/react19-server-actions');

    return {
      success: true,
      message: 'Post został zaktualizowany',
      data
    };

  } catch (error) {
    return {
      success: false,
      error: 'Nie udało się zaktualizować posta'
    };
  }
}

// Server Action: Wyszukaj posty
export async function searchPosts(query: string): Promise<FormResult> {
  'use server';

  try {
    if (!query || query.length < 2) {
      return {
        success: false,
        error: 'Zapytanie musi mieć minimum 2 znaki'
      };
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts'
    );
    const posts = await response.json();

    // Filtruj posty po tytule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = posts.filter((post: any) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      message: `Znaleziono ${filtered.length} postów`,
      data: filtered.slice(0, 5) // Zwróć tylko 5 pierwszych
    };

  } catch (error) {
    return {
      success: false,
      error: 'Błąd wyszukiwania'
    };
  }
}

// Server Action z progressywnym enhancement
export async function subscribeNewsletter(
  prevState: unknown,
  formData: FormData
): Promise<FormResult> {
  'use server';

  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: 'Podaj poprawny adres email'
    };
  }

  await new Promise(resolve => setTimeout(resolve, 1500));

  // Tutaj normalnie byś zapisał do bazy
  console.log('Newsletter subscription:', email);

  return {
    success: true,
    message: `Dziękujemy! Email ${email} został dodany do newslettera.`
  };
}