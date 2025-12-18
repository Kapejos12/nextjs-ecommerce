// app/shop/components/FiltersSidebar.tsx
// Filters Sidebar Component

import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { SearchParams } from '../types/types';
import { getCategories } from '../api/api';

export async function FiltersComponent({ 
  searchParamsPromise 
}: { 
  searchParamsPromise: Promise<SearchParams> 
}) {
  const [params, categories] = await Promise.all([
    searchParamsPromise,
    getCategories()
  ]);

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        position: 'sticky', 
        top: 16,
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2" fontWeight="bold">
          Filters
        </Typography>
      </Box>

      <Box 
        component="form" 
        action="/shop" 
        method="GET" 
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        {/* Search */}
        <TextField
          name="q"
          defaultValue={params.q}
          label="Search"
          placeholder="Search products..."
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />

        {/* Category */}
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            defaultValue={params.category || 'all'}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Range */}
        <TextField
          type="number"
          name="minPrice"
          defaultValue={params.minPrice}
          label="Min Price"
          placeholder="0"
          variant="outlined"
          fullWidth
          size="small"
          inputProps={{ min: 0, step: 10 }}
        />

        <TextField
          type="number"
          name="maxPrice"
          defaultValue={params.maxPrice}
          label="Max Price"
          placeholder="1000"
          variant="outlined"
          fullWidth
          size="small"
          inputProps={{ min: 0, step: 10 }}
        />

        {/* Sort */}
        <FormControl fullWidth size="small">
          <InputLabel>Sort by Price</InputLabel>
          <Select
            name="sort"
            defaultValue={params.sort || ''}
            label="Sort by Price"
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="asc">Low to High</MenuItem>
            <MenuItem value="desc">High to Low</MenuItem>
          </Select>
        </FormControl>

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<FilterListIcon />}
          >
            Apply Filters
          </Button>
          <Button
            component="a"
            href="/shop"
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<ClearIcon />}
            color="inherit"
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}