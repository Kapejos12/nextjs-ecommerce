// app/page.tsx
// Strona główna z Material UI

import {
  Container,
  Box,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Info } from '@mui/icons-material';
import { ProductsSkeleton } from './components/ProductsSkeleton';
import { Suspense } from 'react';
import { ProductsGrid } from './components/ProductsGrid';
import { FiltersSkeleton } from './components/FiltersSkeleton';
import { FiltersComponent } from './components/FiltersComponent';
import { SearchParams } from './types/types';

export default async function HomePage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams>
}) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Shop
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our collection of products
        </Typography>
      </Box>

      {/* Info Box */}
      <Alert 
        severity="success" 
        icon={<Info />}
        sx={{ mb: 3 }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>✨ Next.js 16 Suspense</AlertTitle>
        Filtry działają niezależnie od produktów! Możesz zmieniać filtry nawet gdy produkty się ładują.
      </Alert>

      <Grid container spacing={3}>
        {/* Filters Sidebar - Independent Suspense */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersComponent searchParamsPromise={searchParams} />
          </Suspense>
        </Grid>

        {/* Products Grid - Independent Suspense */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsGrid searchParamsPromise={searchParams} />
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  );
}

// Metadata
export const metadata = {
  title: 'Shop | Your Store',
  description: 'Browse our collection of products',
};