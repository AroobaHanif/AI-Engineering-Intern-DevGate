import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await API.get('/products');
  return res.data;
});

export const fetchGenres = createAsyncThunk('products/fetchGenres', async () => {
  const res = await API.get('/genres');
  return res.data;
});

export const addProduct = createAsyncThunk('products/add', async (data) => {
  const res = await API.post('/products', data);
  return res.data.product;
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }) => {
  const res = await API.put(`/products/${id}`, data);
  return res.data.product;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await API.delete(`/products/${id}`);
  return id;
});

export const fetchFavorites = createAsyncThunk('products/fetchFavorites', async () => {
  const res = await API.get('/favorites');
  return res.data;
});

export const toggleFavorite = createAsyncThunk('products/toggleFavorite', async ({ id, isFav }) => {
  if (isFav) {
    await API.delete(`/favorites/remove/${id}`);
  } else {
    await API.post(`/favorites/add/${id}`);
  }
  const res = await API.get('/favorites');
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], favorites: [], genres: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export default productSlice.reducer;