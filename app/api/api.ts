// app/shop/api.ts
// API utility functions

import { Category, Product, SearchParams } from "../types/types";


// Fetch products with filters
export async function searchProducts(params: SearchParams): Promise<Product[]> {
  const response = await fetch('https://dummyjson.com/products?limit=100');
  const data = await response.json();

  // Multiply to 1000+ products
  const largeDataset = Array.from({ length: 10 }, (_, i) => 
    data.products.map((product: { id: number }) => ({
      ...product,
      id: product.id + (i * 100)
    }))
  ).flat();
  
  let products: Product[] = largeDataset;

  // Apply search query filter
  if (params.q) {
    const query = params.q.toLowerCase();
    products = products.filter(p => 
      p.title.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (params.category && params.category !== null && params.category !== undefined) {
    products = products.filter(p => 
      p.category === params.category
    );
  }

  // Apply min price filter
  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    products = products.filter(p => p.price >= min);
  }

  // Apply max price filter
  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    products = products.filter(p => p.price <= max);
  }

  // Apply sorting
  if (params.sort) {
    products.sort((a, b) => {
      return params.sort === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    });
  }

  return products;
}

// Fetch available categories
export async function getCategories(): Promise<Category[]> {
  const res = await fetch('https://dummyjson.com/products/categories', {
    next: { revalidate: 3600 }
  });
  return res.json();
}