// app/shop/components/ProductsSkeleton.tsx
// Loading skeleton for products grid

import { Box, Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';

export function ProductsSkeleton() {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Skeleton variant="text" width={200} height={32} />
      </Box>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
            <Card>
              <Skeleton variant="rectangular" height={250} />
              <CardContent>
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="30%" height={32} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}