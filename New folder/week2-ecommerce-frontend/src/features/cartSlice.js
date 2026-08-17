import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await API.get('/cart');
  return res.data;
});

export const addToCart = createAsyncThunk('cart/add', async (productId) => {
  const res = await API.post(`/cart/add/${productId}`);
  return res.data.cart;
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId) => {
  const res = await API.delete(`/cart/remove/${productId}`);
  return res.data.cart;
});

export const placeOrder = createAsyncThunk('cart/order', async () => {
  const res = await API.post('/order');
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], orderNumber: null, status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderNumber = action.payload.orderNumber;
        state.items = [];
      });
  },
});

export default cartSlice.reducer;