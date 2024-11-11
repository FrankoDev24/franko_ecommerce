import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunk for adding a new product
export const addProduct = createAsyncThunk('products/addProduct', async (productData) => {
  const response = await axios.post(`${API_BASE_URL}/Product/Product-Post`, productData);
  return response.data; // Assuming the response returns the added product
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
export const updateProductImage = createAsyncThunk(
  'products/updateProductImage',
  async ({ Productid, ImageName }) => {
    const formData = new FormData();
    formData.append('Productid', Productid);
    formData.append('ImageName', ImageName); // assuming ImageName is a File object

    const response = await axios.post(
      `${API_BASE_URL}/Product/Product-Image-Edit`,
      formData,
      {
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    

    return response.data; // Assuming the response returns the updated product
  }

);

// Async thunk for fetching all products

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get`);

  // Assuming response.data contains the product list and each product has a `createdAt` field
  const sortedProducts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return sortedProducts;
});

// Async thunk for fetching products by brand
export const fetchProductsByBrand = createAsyncThunk('products/fetchProductsByBrand', async (brandId) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-Brand/${brandId}`);
  
  // Sort by `createdAt` or `updatedAt`
  const sortedProducts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return sortedProducts;
});

export const fetchProductsByShowroom = createAsyncThunk('products/fetchProductsByShowroom', async (showRoomID) => {
  const response = await axios.get(`${API_BASE_URL}/Product/Product-Get-by-ShowRoom/${showRoomID}`);

  const sortedProducts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { showRoomID, products: sortedProducts };
});




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
    filteredProducts: [], // Add filteredProducts here to avoid undefined errors
    productsByShowroom: {},
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.filteredProducts = []; // Clear filteredProducts on clear
      state.productsByShowroom = {};
      state.currentProduct = null;
      state.error = null;
    },
    searchProducts: (state, action) => {
      const { query, brand, category } = action.payload;
    
      // Filter products by name, brand, or category
      state.filteredProducts = state.products.filter((product) => {
        const name = product.name ? product.name.toLowerCase() : ''; // Ensure name exists before calling .toLowerCase()
        const productBrand = product.brand ? product.brand.toLowerCase() : ''; // Ensure brand exists before calling .toLowerCase()
        const productCategory = product.category ? product.category.toLowerCase() : ''; // Ensure category exists before calling .toLowerCase()
    
        const matchesName = name.includes(query.toLowerCase());
        const matchesBrand = brand ? productBrand.includes(brand.toLowerCase()) : true;
        const matchesCategory = category ? productCategory.includes(category.toLowerCase()) : true;
        
        return matchesName && matchesBrand && matchesCategory;
      });
    }
    
  },
  extraReducers: (builder) => {
    // Handle adding a product
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
      // Handle updating a product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(item => item.Productid === action.payload.Productid);
        if (index !== -1) {
          state.products[index] = action.payload; // Update the existing product
        } else {
          console.error('Product not found for update:', action.payload);
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle updating a product's image
      .addCase(updateProductImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.Productid === action.payload.Productid);
        if (index !== -1) {
          state.products[index] = action.payload; // Update the product's image
        } else {
          console.error('Product not found for image update:', action.payload);
        }
      })
      .addCase(updateProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle fetching all products
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
    // Inside extraReducers
.addCase(fetchProductsByShowroom.fulfilled, (state, action) => {
  const { showRoomID, products } = action.payload;

  state.productsByShowroom[showRoomID] = products; // Update products for that showroom
  state.loading = false;
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
        state.currentProduct = action.payload; // Set the current product details
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the clearProducts action
export const { clearProducts , searchProducts} = productSlice.actions;

// Export the reducer
export default productSlice.reducer;
