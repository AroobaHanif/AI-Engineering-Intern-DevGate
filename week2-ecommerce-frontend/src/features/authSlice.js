import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const loginUser = createAsyncThunk(
  'auth/login', 
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Login failed. Please try again.'
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup', 
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/signup', data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Signup failed. Please try again.'
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword', 
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.put('/update-password', data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Password update failed. Please try again.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    username: localStorage.getItem('username') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.username = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.role = action.payload.role;                     // REDUX STORE UPDATE
        state.role = action.payload.role;                    
        state.username = action.payload.username;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Signup failed';
      })
      
      // ADDED: Update Password
      .addCase(updatePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Password update failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;