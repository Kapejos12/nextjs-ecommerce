/* eslint-disable @next/next/no-img-element */
// app/products/[id]/page.tsx
// Dynamic Product Page with Material UI v6


import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Grid from '@mui/material/Grid';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  IconButton,
  Skeleton,
  Alert,
  AlertTitle,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/Info';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Pobierz produkt
async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Pobierz powiązane produkty
async function getRelatedProducts(category: string): Promise<Product[]> {
  const res = await fetch(`https://dummyjson.com/products/category/${category}`, {
    next: { revalidate: 600 }
  });
  const products = await res.json();
  return products.slice(0, 3);
}

// Related Products Component
async function RelatedProducts({ category }: { category: string }) {
  const products = await getRelatedProducts(category);

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Related Products
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {products.map(product => (
          <Grid size={{ xs: 12, sm: 4 }} key={product.id}>
            <Card sx={{ 
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}>
              <CardActionArea href={`/products/${product.id}`}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50',
                    p: 2
                  }}
                >
                  <img 
                    src={product.images} 
                    alt={product.title}
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain' 
                    }}
                  />
                </CardMedia>
                <CardContent>
                  <Typography 
                    variant="body2" 
                    component="h3"
                    fontWeight={500}
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.5em',
                      mb: 1
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
    </Box>
  );
}

// Loading Component
function RelatedProductsLoading() {
  return (
    <Box sx={{ mt: 6 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        {[1, 2, 3].map(i => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}>
            <Card>
              <Skeleton variant="rectangular" height={180} />
              <CardContent>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Main Product Page
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link 
          href="/" 
          underline="hover" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        <Link href="/products" underline="hover" color="inherit">
          Products
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      {/* Info Alert */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mb: 3 }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>Dynamic Route</AlertTitle>
        Ta strona używa <Box component="code" sx={{ bgcolor: 'info.light', px: 0.5, borderRadius: 0.5 }}>[id]</Box> parametru. 
        URL: <Box component="code" sx={{ bgcolor: 'info.light', px: 0.5, borderRadius: 0.5 }}>/products/{id}</Box>
      </Alert>

      {/* Product Content */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
                borderRadius: 2,
                p: 4,
                minHeight: 400
              }}
            >
              <img 
                src={product.images} 
                alt={product.title}
                style={{ 
                  maxHeight: 400, 
                  maxWidth: '100%',
                  objectFit: 'contain' 
                }}
              />
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              {/* Category */}
              <Chip 
                label={product.category} 
                color="secondary"
                sx={{ 
                  mb: 2, 
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />

              {/* Title */}
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {product.title}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating 
                  value={product.rating.rate} 
                  precision={0.5} 
                  readOnly 
                  size="large"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {product.rating.rate} ({product.rating.count} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Typography 
                variant="h3" 
                color="success.main" 
                fontWeight="bold" 
                sx={{ mb: 3 }}
              >
                ${product.price}
              </Typography>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  sx={{ py: 1.5 }}
                >
                  Add to Cart
                </Button>
                <IconButton 
                  size="large"
                  color="error"
                  sx={{ 
                    border: 1, 
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'white'
                    }
                  }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
              </Box>

              {/* Meta Information */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Product ID:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {product.id}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {product.category}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Availability:
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="success.main">
                    In Stock
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Related Products - Streamowane */}
      <Suspense fallback={<RelatedProductsLoading />}>
        <RelatedProducts category={product.category} />
      </Suspense>
    </Container>
  );
}

// Generate Static Params
export async function generateStaticParams() {
  const products = await fetch('https://dummyjson.com/products')
    .then(res => res.json());

  return products.map((product: Product) => ({
    id: product.id.toString(),
  }));
}

// Dynamic Metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.title} | Your Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.images],
    },
  };
}