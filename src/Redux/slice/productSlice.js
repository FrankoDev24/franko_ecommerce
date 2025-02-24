import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunk for adding a new product
export const addProduct = createAsyncThunk('products/addProduct', async (productData) => {
  const response = await axios.post(`${API_BASE_URL}/Product/Product-Post`, productData);
  return response.data;
});

// Async thunk for updating a product
export const updateProduct = createAsyncThunk('products/updateProduct', async (productData) => {
  const { Productid, ...restData } = productData;

  const response = await axios.post(
    `https://smfteapi.salesmate.app/Product/Product_Put/${Productid}`,
    restData,
    {
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
});

// Async thunk for updating a product's image

// Async thunk for updating a product's image
export const updateProductImage = createAsyncThunk(
  'products/updateProductImage',
  async ({ productID, imageFile }) => {
    const formData = new FormData();
    formData.append('ProductId', productID);  // Ensure this key matches backend
    formData.append('ImageName', imageFile); // Ensure this key matches backend
    
    const response = await axios.post(`${API_BASE_URL}/Product/Product-Image-Edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
);

// Async thunk for fetching all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get`);
  return response.data.sort((a, b) => new Date(b.created) - new Date(a.created));
});

// Async thunk for fetching products by brand
export const fetchProductsByBrand = createAsyncThunk('products/fetchProductsByBrand', async (brandId) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-Brand/${brandId}`);
  return response.data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
});

export const fetchProductsByShowroom = createAsyncThunk('products/fetchProductsByShowroom', async (showRoomID) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-ShowRoom/${showRoomID}`);
  return { showRoomID, products: response.data.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)) };
});

// Async thunk for fetching a product by its ID
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-Product_ID/${productId}`);
  return response.data;
});

// Create the product slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],

    filteredProducts: [],
    productsByShowroom: {},
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.filteredProducts = [];
      state.productsByShowroom = {};
      state.currentProduct = null;
      state.error = null;

    },
    setProductsCache: (state, action) => {
      const { brandId, products } = action.payload;
      state.productsCache[brandId] = products;
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
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
        const index = state.products.findIndex(item => item.Productid === action.payload.Productid);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(updateProductImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(item => item.Productid === action.payload.Productid);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProductImage.rejected, (state, action) => {
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
      .addCase(fetchProductsByShowroom.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByShowroom.fulfilled, (state, action) => {
        state.loading = false;
        const { showRoomID, products } = action.payload;
        state.productsByShowroom[showRoomID] = products;
      })
      .addCase(fetchProductsByShowroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
},
});
// Export the reducer and actions
export const { clearProducts, setFilteredProducts, setProductsCache } = productSlice.actions;
export default productSlice.reducer;
