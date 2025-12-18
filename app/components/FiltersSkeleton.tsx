// app/shop/components/FiltersSkeleton.tsx
// Loading skeleton for filters sidebar

import { Paper, Skeleton } from '@mui/material';

export function FiltersSkeleton() {
  return (
    <Paper elevation={2} sx={{ p: 3, height: 500 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
    </Paper>
  );
}