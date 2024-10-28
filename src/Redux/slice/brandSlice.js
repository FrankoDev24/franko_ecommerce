// src/Redux/Slice/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch brands
export const fetchBrands = createAsyncThunk('brand/fetchBrands', async () => {
    const response = await axios.get(`${API_BASE_URL}/Brand/Get-Brand`);
    return response.data; // Adjust based on your backend response
});

// Add a new brand
export const addBrand = createAsyncThunk('brand/addBrand', async (brandData) => {
    const response = await axios.post(`${API_BASE_URL}/Brand/Setup-Brand`, brandData);
    return response.data; // Adjust based on your backend response
});

const brandSlice = createSlice({
    name: 'brands',
    initialState: {
        brands: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload; // Store the fetched brands
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Capture error message
            })
            .addCase(addBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands.push(action.payload); // Add the new brand to the state
            })
            .addCase(addBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Capture error message
            });
    },
});

export default brandSlice.reducer;
