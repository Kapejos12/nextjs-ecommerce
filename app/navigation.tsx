'use client';

import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
} from '@mui/material';

export default function Navigation() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            Next.js 16 ECommerce API Demo
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              component={Link}
              href="/"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Home
            </Button>
            
            {/* <Button 
              component={Link}
              href="/posts"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Server Component
            </Button>
            
            <Button 
              component={Link}
              href="/posts-client"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Client Component
            </Button>
            
            <Button 
              component={Link}
              href="/react19-demo"
              color="secondary"
              sx={{ fontWeight: 600 }}
            >
              React 19
            </Button>
            
            <Button 
              component={Link}
              href="/react19-server-actions"
              color="success"
              sx={{ fontWeight: 600 }}
            >
              Actions
            </Button>
            
            <Button 
              component={Link}
              href="/shop"
              color="secondary"
              sx={{ fontWeight: 600 }}
            >
              Shop
            </Button> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}