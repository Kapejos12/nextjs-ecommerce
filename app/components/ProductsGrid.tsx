/* eslint-disable @next/next/no-img-element */ 
// app/shop/components/ProductsGrid.tsx
// Products Grid Component

import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { Product, SearchParams } from '../types/types';
import { searchProducts } from '../api/api';

export async function ProductsGrid({ 
  searchParamsPromise 
}: { 
  searchParamsPromise: Promise<SearchParams> 
}) {
  const params = await searchParamsPromise;
  const products = await searchProducts(params);

  return (
    <>
      {/* Results header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Found <Typography component="span" fontWeight="bold" color="text.primary">{products.length}</Typography> products
          {params.q && (
            <Typography component="span">
              {' '}for &quot;<Typography component="span" fontWeight="bold">{params.q}</Typography>&quot;
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Products */}
      {products.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            bgcolor: 'grey.50',
            borderRadius: 2
          }}
        >
          <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try adjusting your filters
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {products.map((product: Product) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardActionArea 
                  href={`/products/${product.id}`}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 250,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.50',
                      p: 3,
                      '& img': {
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s',
                      },
                      '&:hover img': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <img 
                      src={product.images} 
                      alt={product.title}
                    />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="secondary"
                      sx={{ mb: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}
                    />
                    <Typography 
                      variant="subtitle1" 
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '3em'
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      ${product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}