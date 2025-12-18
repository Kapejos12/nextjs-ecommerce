/* eslint-disable @typescript-eslint/no-explicit-any */
// app/react19-demo/page.tsx
'use client';

import { use, useOptimistic, useActionState, useState, useTransition, Suspense } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  AlertTitle,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';

// Symulacja Promise dla demonstracji use()
const fetchUserData = () => {
  return new Promise<{ name: string; email: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Jan Kowalski',
        email: 'jan@example.com'
      });
    }, 1000);
  });
};

// Komponent demonstrujący use() hook
function UserProfile({ userPromise }: { userPromise: Promise<{ name: string; email: string }> }) {
  // NOWOŚĆ React 19: use() - odczyt Promise bezpośrednio
  const user = use(userPromise);

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PersonIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          User Profile (use hook)
        </Typography>
      </Box>
      <Typography variant="body1" color="text.primary" gutterBottom>
        Name: {user.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Email: {user.email}
      </Typography>
    </Paper>
  );
}

// Komponent demonstrujący useOptimistic()
function OptimisticTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Naucz się React 19', completed: false },
    { id: 2, text: 'Zbuduj aplikację Next.js 16', completed: false },
  ]);

  // NOWOŚĆ React 19: useOptimistic() - optymistyczna aktualizacja UI
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: { id: number; text: string; completed: boolean }) => {
      return [...state, newTodo];
    }
  );

  const addTodo = async (formData: FormData) => {
    const text = formData.get('todo') as string;
    if (!text) return;

    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };

    // Natychmiastowa aktualizacja UI (optimistic)
    addOptimisticTodo(newTodo);

    // Symulacja API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Rzeczywista aktualizacja state
    setTodos(prev => [...prev, newTodo]);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CheckCircleIcon color="success" />
        <Typography variant="h6" fontWeight="bold">
          Optimistic Updates
        </Typography>
      </Box>
      
      <Box component="form" action={addTodo} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            name="todo"
            placeholder="Dodaj nowe zadanie..."
            size="small"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ minWidth: 100 }}
          >
            Dodaj
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary">
          💡 Zadanie pojawi się natychmiast, mimo 2s opóźnienia API
        </Typography>
      </Box>

      <List disablePadding>
        {optimisticTodos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              bgcolor: 'grey.50',
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 1,
              mb: 1,
              py: 1
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Checkbox checked={todo.completed} disabled size="small" />
            </ListItemIcon>
            <ListItemText 
              primary={todo.text}
              primaryTypographyProps={{
                sx: {
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// Komponent demonstrujący useActionState()
function FormWithActionState() {
  // NOWOŚĆ React 19: useActionState() - zarządzanie stanem akcji formularza
  const [state, formAction, isPending] = useActionState(
    async (previousState: any, formData: FormData) => {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;

      // Walidacja
      if (!name || !email) {
        return { error: 'Wszystkie pola są wymagane', success: false };
      }

      // Symulacja API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        message: `Witaj ${name}! Email ${email} został zapisany.`,
        error: null
      };
    },
    { success: false, message: '', error: null }
  );

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SendIcon color="secondary" />
        <Typography variant="h6" fontWeight="bold">
          Form Actions
        </Typography>
      </Box>
      
      <Box component="form" action={formAction} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="name"
          label="Imię"
          disabled={isPending}
          fullWidth
          size="small"
        />

        <TextField
          name="email"
          type="email"
          label="Email"
          disabled={isPending}
          fullWidth
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isPending}
          fullWidth
          size="large"
        >
          {isPending ? '⏳ Wysyłanie...' : 'Wyślij'}
        </Button>
      </Box>

      {/* Status messages */}
      {state.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {state.error}
        </Alert>
      )}
      
      {state.success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {state.message}
        </Alert>
      )}
    </Paper>
  );
}

// Komponent demonstrujący useTransition z nowymi możliwościami
function TransitionDemo() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<number[]>([]);

  const generateItems = () => {
    startTransition(() => {
      const newItems = Array.from({ length: 1000 }, (_, i) => i + 1);
      setItems(newItems);
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FlashOnIcon color="warning" />
        <Typography variant="h6" fontWeight="bold">
          Transitions
        </Typography>
      </Box>
      
      <Button
        onClick={generateItems}
        variant="contained"
        color="success"
        disabled={isPending}
        fullWidth
        size="large"
        sx={{ mb: 1 }}
      >
        {isPending ? '⏳ Generowanie...' : 'Generuj 1000 elementów'}
      </Button>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        💡 UI pozostaje responsywne podczas ciężkiej operacji
      </Typography>

      {items.length > 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            bgcolor: 'grey.50',
            border: 1,
            borderColor: 'grey.200',
            maxHeight: 128,
            overflowY: 'auto'
          }}
        >
          <Typography variant="body2" gutterBottom>
            Wygenerowano {items.length} elementów
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {items.map(item => (
              <Typography key={item} variant="caption" color="text.secondary">
                Element #{item}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
    </Paper>
  );
}

// Główny komponent strony
export default function React19DemoPage() {
  const [userPromise] = useState(() => fetchUserData());

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
              color: 'white',
              borderRadius: 2,
              p: 1,
              display: 'flex',
            }}
          >
            <CodeIcon />
          </Box>
          <Typography variant="h3" component="h1" fontWeight="bold">
            React 19 - Nowe Funkcjonalności
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Poznaj nowe hooki i możliwości React 19.2.1 w praktyce
        </Typography>
      </Box>

      {/* Info Box */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, #EBF4FF 0%, #F3E8FF 100%)',
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>React 19 Features</AlertTitle>
        <List dense disablePadding>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="✨ use() - Odczyt Promise i Context"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="⚡ useOptimistic() - Optymistyczne aktualizacje UI"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="📝 useActionState() - Zarządzanie stanem akcji formularza"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem disableGutters sx={{ py: 0.25 }}>
            <ListItemText 
              primary="🔄 useTransition() - Ulepszone przejścia bez blokowania UI"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>
      </Alert>

      {/* Grid z przykładami */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* use() Hook - z Suspense */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" variant="outlined">
              <AlertTitle sx={{ fontWeight: 'bold' }}>1. use() Hook</AlertTitle>
              <Typography variant="body2">
                Automatyczne oczekiwanie na Promise bez useEffect
              </Typography>
            </Alert>
            <Suspense fallback={
              <Paper elevation={2} sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="50%" />
              </Paper>
            }>
              <UserProfile userPromise={userPromise} />
            </Suspense>
          </Box>
        </Grid>

        {/* useOptimistic() */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success" variant="outlined">
              <AlertTitle sx={{ fontWeight: 'bold' }}>2. useOptimistic() Hook</AlertTitle>
              <Typography variant="body2">
                UI reaguje natychmiast, nawet przed odpowiedzią z serwera
              </Typography>
            </Alert>
            <OptimisticTodoList />
          </Box>
        </Grid>

        {/* useActionState() */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" variant="outlined">
              <AlertTitle sx={{ fontWeight: 'bold' }}>3. useActionState() Hook</AlertTitle>
              <Typography variant="body2">
                Łatwe zarządzanie formularzami z validacją i loading states
              </Typography>
            </Alert>
            <FormWithActionState />
          </Box>
        </Grid>

        {/* useTransition() */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="warning" variant="outlined">
              <AlertTitle sx={{ fontWeight: 'bold' }}>4. useTransition() Hook</AlertTitle>
              <Typography variant="body2">
                Ciężkie operacje nie blokują interfejsu użytkownika
              </Typography>
            </Alert>
            <TransitionDemo />
          </Box>
        </Grid>
      </Grid>

      {/* Code Examples Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4,
          bgcolor: 'grey.900',
          color: 'white'
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📚 Przykłady kodu
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Chip 
              label="use() Hook" 
              color="info" 
              size="small" 
              sx={{ mb: 1, fontWeight: 'bold' }} 
            />
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                bgcolor: 'grey.800',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflowX: 'auto'
              }}
            >
              <pre style={{ margin: 0 }}>
{`const user = use(userPromise);
return <div>{user.name}</div>;`}
              </pre>
            </Paper>
          </Box>

          <Box>
            <Chip 
              label="useOptimistic() Hook" 
              color="success" 
              size="small" 
              sx={{ mb: 1, fontWeight: 'bold' }} 
            />
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                bgcolor: 'grey.800',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflowX: 'auto'
              }}
            >
              <pre style={{ margin: 0 }}>
{`const [optimisticData, addOptimistic] = useOptimistic(
  data,
  (state, newItem) => [...state, newItem]
);`}
              </pre>
            </Paper>
          </Box>

          <Box>
            <Chip 
              label="useActionState() Hook" 
              color="secondary" 
              size="small" 
              sx={{ mb: 1, fontWeight: 'bold' }} 
            />
            <Paper 
              elevation={0}
              sx={{ 
                p: 2, 
                bgcolor: 'grey.800',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflowX: 'auto'
              }}
            >
              <pre style={{ margin: 0 }}>
{`const [state, formAction, isPending] = useActionState(
  async (prev, formData) => {
    // Process form
    return { success: true };
  },
  initialState
);`}
              </pre>
            </Paper>
          </Box>
        </Box>
      </Paper>

      {/* Info footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          💡 Wszystkie te funkcje działają w React 19.2.1 + Next.js 16
        </Typography>
      </Box>
    </Container>
  );
}