import { configureStore } from '@reduxjs/toolkit';
import emailReducer from '../features/emailSlice';

export const store = configureStore({
  reducer: {
    email: emailReducer,
  },
});