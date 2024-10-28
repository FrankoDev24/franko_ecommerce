// src/Redux/slice/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'http://197.251.217.45:5000';

// Async thunk for adding a new product
export const addProduct = createAsyncThunk('products/addProduct', async (productData) => {
  const response = await axios.post(`${API_BASE_URL}/Product/Product-Post`, productData);
  return response.data; // Assuming the response returns the added product
});

// Async thunk for updating a product
export const updateProduct = createAsyncThunk('products/updateProduct', async (productData) => {
  const response = await axios.put(`${API_BASE_URL}/Product/Product-Put`, productData);
  return response.data; // Assuming the response returns the updated product
});

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get`);
  return response.data; // Assuming the response data contains the product list
});

// Async thunk for fetching products by brand
export const fetchProductsByBrand = createAsyncThunk('products/fetchProductsByBrand', async (brandId) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-Brand/${brandId}`);
  return response.data; // Assuming the response data contains the filtered product list
});

// Async thunk for fetching products by showroom
export const fetchProductsByShowroom = createAsyncThunk(
    'products/fetchProductsByShowroom',
    async (showRoomID) => {
      const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-Showroom/${showRoomID}`);
      console.log("Fetched products:", response.data); // Log response data
      return response.data;
    }
);

// Async thunk for fetching a product by its ID
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-Product_ID/${productId}`);
  return response.data; // Assuming the response data contains the product details
});

// Create the product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null, // Add state for current product details
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.currentProduct = null; // Clear current product on clear
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetching all products
    builder
    .addCase(addProduct.pending, (state) => {
      state.loading = true;
    })
    .addCase(addProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload); // Add the new product to the state
    })
    .addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

    .addCase(updateProduct.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload; // Update the product in the state
      }
    })
    .addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle fetching products by brand
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle fetching products by showroom
      .addCase(fetchProductsByShowroom.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByShowroom.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Ensure payload structure matches your expectations
      })
      .addCase(fetchProductsByShowroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle fetching a product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload; // Store the fetched product details
        console.log("Fetched product:", action.payload); // Check the payload
      })
      
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action to clear products
export const { clearProducts } = productSlice.actions;

// Export the reducer
export default productSlice.reducer;
