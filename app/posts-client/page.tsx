// app/posts-client/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface ApiResponse {
  success: boolean;
  data: Post[];
  count: number;
  error?: string;
}

export default function PostsClientPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  // Funkcja pobierająca dane przez API Route
  const fetchPosts = async (userIdFilter?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Buduj URL z parametrami
      const url = userIdFilter 
        ? `/api/data?userId=${userIdFilter}`
        : '/api/data';

      const response = await fetch(url);
      const result: ApiResponse = await response.json();

      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error || 'Wystąpił błąd');
      }
    } catch (err) {
      setError('Nie udało się pobrać danych');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do tworzenia nowego posta
  const createPost = async () => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Nowy post z Next.js 16',
          content: 'To jest treść utworzona przez Client Component',
          userId: 1
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Post utworzony pomyślnie!');
        fetchPosts(); // Odśwież listę
      }
    } catch (err) {
      console.error('Błąd podczas tworzenia posta:', err);
    }
  };

  // Pobierz dane przy montowaniu
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Posts - Client Component
      </Typography>

      {/* Kontrolki */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Wyszukiwanie */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              placeholder="Filtruj po User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
            <Button
              onClick={() => fetchPosts(userId)}
              disabled={loading}
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Ładowanie...' : 'Szukaj'}
            </Button>
          </Box>

          {/* Przyciski akcji */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => {
                setUserId('');
                fetchPosts();
              }}
              disabled={loading}
              variant="outlined"
              color="inherit"
              startIcon={<RefreshIcon />}
              fullWidth
            >
              Resetuj
            </Button>
            <Button
              onClick={createPost}
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              fullWidth
            >
              Utwórz nowy post
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Komunikaty o błędach */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Błąd: {error}
        </Alert>
      )}

      {/* Stan ładowania */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Ładowanie danych...
          </Typography>
        </Box>
      )}

      {/* Lista postów */}
      {!loading && posts.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ArticleIcon color="primary" />
            <Typography variant="body1" color="text.secondary">
              Znaleziono <Typography component="span" fontWeight="bold" color="text.primary">{posts.length}</Typography> postów
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map((post) => (
              <Card 
                key={post.id}
                elevation={2}
                sx={{ 
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    fontWeight="bold" 
                    gutterBottom
                  >
                    {post.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 2 }}
                  >
                    {post.body}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`User ID: ${post.userId}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`Post ID: ${post.id}`} 
                      size="small" 
                      color="default" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Brak wyników */}
      {!loading && posts.length === 0 && !error && (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: 'grey.50'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Brak postów do wyświetlenia
          </Typography>
        </Paper>
      )}
    </Container>
  );
}