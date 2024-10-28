// src/Redux/slice/showroomSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


// Async thunk for fetching all showrooms
export const fetchShowrooms = createAsyncThunk('showrooms/fetchShowrooms', async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ShowRoom/Get-ShowRoom`);
    return response.data; // Assuming the response data contains the showroom list
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch showrooms';
  }
});

// Async thunk for adding a new showroom
export const addShowroom = createAsyncThunk('showrooms/addShowroom', async (showroomData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ShowRoom/Setup-Showroom`, showroomData);
    return response.data; // Assuming the response returns the added showroom
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add showroom';
  }
});

// Create the showroom slice
const showroomSlice = createSlice({
  name: 'showrooms',
  initialState: {
    showrooms: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearShowrooms: (state) => {
      state.showrooms = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowrooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShowrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.showrooms = action.payload;
      })
      .addCase(fetchShowrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addShowroom.pending, (state) => {
        state.loading = true;
      })
      .addCase(addShowroom.fulfilled, (state, action) => {
        state.loading = false;
        state.showrooms.push(action.payload); // Add the new showroom to the state
      })
      .addCase(addShowroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action to clear showrooms
export const { clearShowrooms } = showroomSlice.actions;

// Export the reducer
export default showroomSlice.reducer;
