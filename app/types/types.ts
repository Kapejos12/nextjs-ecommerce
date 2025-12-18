// app/shop/types.ts
// Shared type definitions

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  images: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: 'asc' | 'desc';
}