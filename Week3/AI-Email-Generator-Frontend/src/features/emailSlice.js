import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateEmail = createAsyncThunk(
  'email/generate',
  async ({ tone, recipient, intent }, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5050/generate-email', {
        tone,
        recipient,
        intent,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to generate email. Try again.');
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    result: null,
    status: 'idle',
    error: '',
  },
  reducers: {
    resetEmail: (state) => {
      state.result = null;
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateEmail.pending, (state) => {
        state.status = 'loading';
        state.error = '';
        state.result = null;
      })
      .addCase(generateEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(generateEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetEmail } = emailSlice.actions;
export default emailSlice.reducer;