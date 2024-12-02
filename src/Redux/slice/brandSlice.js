// src/Redux/Slice/brandSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch brands
export const fetchBrands = createAsyncThunk("brand/fetchBrands", async () => {
  const response = await axios.get(`${API_BASE_URL}/Brand/Get-Brand`);
  return response.data; // Adjust based on your backend response
});

// Add a new brand
export const addBrand = createAsyncThunk(
  "brand/addBrand",
  async (brandData) => {
    // Create a FormData object to send the data as multipart/form-data
    const formData = new FormData();

    // Append each field to the FormData object
    formData.append('BrandId', brandData.BrandId || ''); // Send empty value if BrandId is not provided
    formData.append('BrandName', brandData.BrandName || ''); // Send empty value if BrandName is not provided
    formData.append('CategoryId', brandData.CategoryId || ''); // Send empty value if CategoryId is not provided
    formData.append('LogoName', brandData.LogoName); // Assuming LogoName is a file (binary data)

    // Send the request with the FormData
    const response = await axios.post(
      `${API_BASE_URL}/Brand/Setup-Brand`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      }
    );

    return response.data; // Adjust based on your backend response
  }
);

// Update an existing brand
export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ Brandid, formData }, { rejectWithValue }) => {
    try {
      // Send the request with multipart/form-data headers
      const response = await axios.post(
        `${API_BASE_URL}/Brand/Put-Brand/${Brandid}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update brand"
      );
    }
  }
);

  
  

const brandSlice = createSlice({
  name: "brands",
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
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
      
        const index = state.brands.findIndex(
          (brand) => brand.brandId === action.payload.brandId
        );
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default brandSlice.reducer;
