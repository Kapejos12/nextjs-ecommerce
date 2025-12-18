/* eslint-disable @typescript-eslint/no-explicit-any */
// app/react19-server-actions/page.tsx
'use client';

import { useState, useActionState } from 'react';
import { createPost, deletePost, searchPosts, subscribeNewsletter } from '../actions';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SpeedIcon from '@mui/icons-material/Speed';

// Komponent z formularzem używającym Server Action
function CreatePostForm() {
  const [state, setState] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    const result = await createPost(formData);
    
    setState(result);
    setIsPending(false);

    if (result.success) {
      e.currentTarget.reset();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CreateIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Utwórz Post (Server Action)
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="title"
          label="Tytuł"
          required
          disabled={isPending}
          placeholder="Wprowadź tytuł..."
          fullWidth
          size="small"
        />

        <TextField
          name="content"
          label="Treść"
          required
          disabled={isPending}
          placeholder="Wprowadź treść posta..."
          multiline
          rows={4}
          fullWidth
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          fullWidth
          size="large"
          startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <CreateIcon />}
        >
          {isPending ? 'Tworzenie...' : 'Utwórz Post'}
        </Button>
      </Box>

      {/* Status */}
      {state?.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>Sukces!</AlertTitle>
          {state.message}
          {state.data && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              ID: {state.data.id}
            </Typography>
          )}
        </Alert>
      )}

      {state?.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {state.error}
        </Alert>
      )}

      <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
        <AlertTitle sx={{ fontSize: '0.875rem' }}>💡 Co się dzieje:</AlertTitle>
        <List dense disablePadding>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="Funkcja createPost() działa na serwerze"
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="Bezpieczne API keys i logika biznesowa"
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="Automatyczna serializacja i deserializacja"
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="Progresywne enhancement (działa bez JS!)"
              primaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        </List>
      </Alert>
    </Paper>
  );
}

// Komponent z deletePost Server Action
function DeletePostDemo() {
  const [result, setResult] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [postId, setPostId] = useState('1');

  const handleDelete = async () => {
    setIsPending(true);
    setResult(null);

    const id = parseInt(postId);
    const response = await deletePost(id);
    
    setResult(response);
    setIsPending(false);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <DeleteIcon color="error" />
        <Typography variant="h6" fontWeight="bold">
          Usuń Post (Server Action)
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="number"
          label="ID Posta do usunięcia"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          disabled={isPending}
          inputProps={{ min: 1 }}
          fullWidth
          size="small"
        />

        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isPending}
          fullWidth
          size="large"
          startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
        >
          {isPending ? 'Usuwanie...' : 'Usuń Post'}
        </Button>
      </Box>

      {result?.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {result.message}
        </Alert>
      )}

      {result?.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {result.error}
        </Alert>
      )}
    </Paper>
  );
}

// Komponent z wyszukiwaniem używającym Server Action
function SearchPostsDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const response = await searchPosts(query);
    setResults(response);
    setIsPending(false);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <SearchIcon color="secondary" />
        <Typography variant="h6" fontWeight="bold">
          Wyszukaj Posty (Server Action)
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isPending}
            placeholder="np. 'sunt' lub 'qui'..."
            label="Szukaj po tytule"
            fullWidth
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isPending || query.length < 2}
            sx={{ minWidth: 100 }}
          >
            {isPending ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
          </Button>
        </Box>
      </Box>

      {/* Wyniki */}
      {results?.success && results.data && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            {results.message}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {results.data.map((post: any) => (
              <Paper 
                key={post.id} 
                elevation={0}
                sx={{ 
                  p: 1.5, 
                  bgcolor: 'secondary.lighter',
                  border: 1,
                  borderColor: 'secondary.light'
                }}
              >
                <Typography variant="body2" fontWeight={500} color="secondary.dark">
                  {post.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {post.id}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {results?.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {results.error}
        </Alert>
      )}
    </Paper>
  );
}

// Newsletter z useActionState (React 19)
function NewsletterForm() {
  // NOWOŚĆ React 19: useActionState dla Server Actions
  const [state, formAction, isPending] = useActionState(
    subscribeNewsletter,
    { success: false, message: '', error: '' }
  );

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <EmailIcon />
        <Typography variant="h6" fontWeight="bold">
          Newsletter (useActionState + Server Action)
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
        Połączenie useActionState z Server Action
      </Typography>

      <Box component="form" action={formAction} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField
          name="email"
          type="email"
          required
          disabled={isPending}
          placeholder="twoj@email.com"
          fullWidth
          size="small"
          sx={{
            bgcolor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          fullWidth
          size="large"
          startIcon={isPending ? <CircularProgress size={20} /> : <EmailIcon />}
          sx={{
            bgcolor: 'white',
            color: 'secondary.main',
            '&:hover': {
              bgcolor: 'grey.100',
            },
            '&.Mui-disabled': {
              bgcolor: 'grey.300',
            }
          }}
        >
          {isPending ? 'Zapisywanie...' : 'Zapisz się'}
        </Button>
      </Box>

      {state.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {state.message}
        </Alert>
      )}

      {state.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {state.error}
        </Alert>
      )}
    </Paper>
  );
}

// Główna strona
export default function ServerActionsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
              color: 'white',
              borderRadius: 2,
              p: 1,
              display: 'flex',
            }}
          >
            <IntegrationInstructionsIcon />
          </Box>
          <Typography variant="h3" component="h1" fontWeight="bold">
            React 19 Server Actions
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Funkcje działające wyłącznie po stronie serwera z automatycznym RPC
        </Typography>
      </Box>

      {/* Info Box */}
      <Alert severity="success" icon={<InfoIcon />} sx={{ mb: 4 }}>
        <AlertTitle sx={{ fontWeight: 'bold' }}>Co to są Server Actions?</AlertTitle>
        Funkcje oznaczone <Chip label="'use server'" size="small" sx={{ mx: 0.5 }} /> które działają TYLKO po stronie serwera. 
        React automatycznie tworzy API endpoint i obsługuje serializację. 
        Bezpieczne dla API keys i logiki biznesowej!
      </Alert>

      {/* Grid z przykładami */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CreatePostForm />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DeletePostDemo />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SearchPostsDemo />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NewsletterForm />
        </Grid>
      </Grid>

      {/* Zalety Server Actions */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4,
          bgcolor: 'grey.900',
          color: 'white'
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ✨ Zalety Server Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SecurityIcon color="success" />
                <Typography variant="h6" fontWeight="bold" color="success.light">
                  Bezpieczeństwo
                </Typography>
              </Box>
              <List dense>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• API keys pozostają na serwerze"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Walidacja po stronie serwera"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Brak expose'u logiki biznesowej"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon color="info" />
                <Typography variant="h6" fontWeight="bold" color="info.light">
                  Prostota
                </Typography>
              </Box>
              <List dense>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Bez ręcznego API routing"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Automatyczna serializacja"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Type-safe z TypeScript"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SpeedIcon color="secondary" />
                <Typography variant="h6" fontWeight="bold" color="secondary.light">
                  Performance
                </Typography>
              </Box>
              <List dense>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Mniej kodu po stronie klienta"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Progresywne enhancement"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Działa bez JavaScript!"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FlashOnIcon color="warning" />
                <Typography variant="h6" fontWeight="bold" color="warning.light">
                  Integracja
                </Typography>
              </Box>
              <List dense>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Bezpośrednie wywołanie z komponentów"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Współpraca z useActionState"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem disableGutters sx={{ py: 0.25 }}>
                  <ListItemText 
                    primary="• Cache revalidation (revalidatePath)"
                    primaryTypographyProps={{ variant: 'body2', color: 'grey.300' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}