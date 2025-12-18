  
// app/shop/page.tsx
// Main Shop Page with Independent Suspense Boundaries

import { Suspense } from 'react';
import {
  Container,
  Alert,
  AlertTitle,
  Box,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';
import { SearchParams } from '../types/types';
import { FiltersComponent } from '../components/FiltersComponent';
import { FiltersSkeleton } from '../components/FiltersSkeleton';
import { ProductsSkeleton } from '../components/ProductsSkeleton';
import { ProductsGrid } from '../components/ProductsGrid';

// Main Page Component
export default function ShopPage({ 
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
        icon={<InfoIcon />}
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