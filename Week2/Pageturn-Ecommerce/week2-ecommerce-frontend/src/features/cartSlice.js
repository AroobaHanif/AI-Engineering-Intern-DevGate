import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// CREATE - Add to cart
export const addToCart = createAsyncThunk('cart/add', async (productId) => {
  const res = await API.post(`/cart/add/${productId}`);
  return res.data.cart;
});

// READ - Get cart
export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await API.get('/cart');
  return res.data;
});

// UPDATE - Update quantity
export const updateCartQuantity = createAsyncThunk('cart/update', async (productId) => {
  const res = await API.put(`/cart/update/${productId}`);
  return res.data.cart;
});

// UPDATE - Decrease quantity
export const decreaseCartItem = createAsyncThunk('cart/decrease', async (productId) => {
  const res = await API.put(`/cart/decrease/${productId}`);
  return res.data.cart;
});

// DELETE - Remove from cart
export const removeFromCart = createAsyncThunk('cart/remove', async (productId) => {
  const res = await API.delete(`/cart/remove/${productId}`);
  return res.data.cart;
});

// DELETE ALL - Clear cart
export const clearCart = createAsyncThunk('cart/clear', async () => {
  await API.delete('/cart/clear');
  return [];
});

// ORDER - Place order
export const placeOrder = createAsyncThunk('cart/order', async () => {
  const res = await API.post('/order');
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    items: [], 
    orderNumber: null, 
    status: 'idle' 
  },
  reducers: {
    resetOrder: (state) => {
      state.orderNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.status = 'succeeded';
      })
      .addCase(decreaseCartItem.fulfilled, (state, action) => {
      state.items = action.payload;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderNumber = action.payload.orderNumber;
        state.items = [];       // after placing order, cart empty 
        state.status = 'succeeded';
      });
  },
});

export const { resetOrder } = cartSlice.actions;
export default cartSlice.reducer;