// app/layout.tsx
// Root Layout z Material UI

import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { theme } from './theme';
import Navigation from './navigation';

export const metadata: Metadata = {
  title: 'Next.js 16 API Example',
  description: 'Przykład pobierania danych z API w Next.js 16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body style={{ margin: 0 }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              {/* Nawigacja - Client Component */}
              <Navigation />

              {/* Główna zawartość */}
              <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
                {children}
              </Box>

              {/* Footer */}
              <Box 
                component="footer" 
                sx={{ 
                  bgcolor: 'background.paper',
                  borderTop: 1,
                  borderColor: 'divider',
                  py: 3,
                  mt: 'auto'
                }}
              >
                <Container maxWidth="xl">
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    align="center"
                  >
                    Next.js 16.0.10 + React 19.2.1 + TypeScript + Material UI
                  </Typography>
                </Container>
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}