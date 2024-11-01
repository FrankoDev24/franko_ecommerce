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
    const response = await axios.post(`${API_BASE_URL}/ShowRoom/Setup-Showroom`, showroomData, {
      headers: {
        'Content-Type': 'application/json', // Ensure the correct content type
      },
    });
    return response.data; // Assuming the response returns the added showroom
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add showroom';
  }
});

// Async thunk for updating a showroom
export const updateShowroom = createAsyncThunk('showrooms/updateShowroom', async ({ Showroomid, ...showroomData }) => {
  try {
    // Send the request using the correct URL and payload
    const response = await axios.post(`${API_BASE_URL}/ShowRoom/Showroom-Put/${Showroomid}`, showroomData, {
      headers: {
        'Content-Type': 'application/json', // Ensure the correct content type
      },
    });
    return response.data; // Assuming the response returns the updated showroom
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update showroom';
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
        state.showrooms = action.payload; // Update the state with fetched showrooms
      })
      .addCase(fetchShowrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set the error message
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
        state.error = action.error.message; // Set the error message
      })
      .addCase(updateShowroom.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShowroom.fulfilled, (state, action) => {
        state.loading = false;
        // Update the showroom in the state
        const index = state.showrooms.findIndex(showroom => showroom.showRoomID === action.payload.showRoomID);
        if (index !== -1) {
          state.showrooms[index] = action.payload; // Replace the old showroom with the updated one
        }
      })
      .addCase(updateShowroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set the error message
      });
  },
});

// Export the action to clear showrooms
export const { clearShowrooms } = showroomSlice.actions;

// Export the reducer
export default showroomSlice.reducer;
