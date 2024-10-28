import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  cart: [], // This will hold the items in the cart
  totalItems: 0, // This will track the total number of items for the cart icon
  transactionNumber: localStorage.getItem('transactionNumber') || uuidv4(),
  loading: false,
  error: null,
};

// Async Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      // Attempt to retrieve the existing transaction number from local storage
      let transactionNumber = localStorage.getItem('transactionNumber');

      // Check for undefined value
      if (transactionNumber === 'undefined') {
        console.warn("Transaction number retrieved as 'undefined'. Generating a new one.");
        transactionNumber = uuidv4(); // Generate a new transaction number
        localStorage.setItem('transactionNumber', transactionNumber); // Store it in local storage
      } else if (!transactionNumber) {
        console.log('No existing transaction number found. Generating a new one.');
        transactionNumber = uuidv4(); // Generate a new one
        localStorage.setItem('transactionNumber', transactionNumber); // Store it in local storage
      } else {
        console.log('Existing Transaction Number retrieved:', transactionNumber);
      }

      // Create the cart item object
      const cartItem = {
        transactionNumber,
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
      };

      console.log('Cart Item to be added:', cartItem); // Debug log

      // Make the API request to add the item to the cart
      const response = await axios.post('http://197.251.217.45:5000/Cart/Add-To-Cart', cartItem);

      // Return the response data
      return { ...cartItem, ...response.data }; 
    } catch (error) {
      console.error("Error adding to cart:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getCartById = createAsyncThunk(
  'cart/getCartById',
  async (id, { rejectWithValue }) => {
      try {
          const response = await axios.get(`http://197.251.217.45:5000/Cart/Cart-GetbyID/${id}`);
          console.log('Fetched cart data:', response.data); // Log the fetched data
          return response.data;
      } catch (error) {
          console.error("Error fetching cart by ID:", error);
          return rejectWithValue(error.message);
      }
  }
);


export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://197.251.217.45:5000/Cart/Cart-Update/${cartId}/${productId}/${quantity}`);
      return response.data; // Return the updated item data
    } catch (error) {
      console.error("Error updating cart item:", error.message); // Log detailed error
      return rejectWithValue(error.message === "Network Error" ? "Network connectivity issue" : error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://197.251.217.45:5000/Cart/Cart-Delete/${cartId}/${productId}`);
      return { cartId, productId };
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action) => {
      const itemIndex = state.cart.findIndex((item) => item.productId === action.payload.productId);
      if (itemIndex >= 0) {
        state.cart[itemIndex].quantity += 1; // Increment quantity
      } else {
        state.cart.push({ ...action.payload, quantity: 1 }); // Add new item
      }
      state.totalItems += 1; // Increment total items count
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cart.findIndex((item) => item.productId === action.payload.productId);
      if (itemIndex >= 0) {
        state.totalItems -= state.cart[itemIndex].quantity; // Decrement total items count
        state.cart.splice(itemIndex, 1); // Remove the item
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalItems = 0; // Reset total items count
      state.transactionNumber = uuidv4();
      localStorage.setItem('transactionNumber', state.transactionNumber);
    },
    setCartItems(state, action) {
      state.items = action.payload;
      state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
    },

  },
  
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart.push(action.payload);
        state.totalItems += action.payload.quantity; // Increment total items
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getCartById.fulfilled, (state, action) => {
        state.cart = action.payload; // Ensure this includes transactionNumber
        state.loading = false;
    })
    .addCase(getCartById.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(getCartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
    })
   
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        const { productId, quantity } = action.payload;
        const itemIndex = state.cart.findIndex(item => item.productId === productId); // Find the item index

        if (itemIndex !== -1) {
          state.cart[itemIndex].quantity = quantity; // Update quantity
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload || action.error.message; // Set error state
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const itemIndex = state.cart.findIndex(item => item.productId === action.payload.productId);
        if (itemIndex !== -1) {
          state.totalItems -= state.cart[itemIndex].quantity; // Decrement total items
          state.cart.splice(itemIndex, 1); // Remove the item from cart
        }
        if (state.cart.length === 0) {
          state.transactionNumber = uuidv4();
          localStorage.setItem('transactionNumber', state.transactionNumber);
        }
      });
  },
});
  

export const { clearCart , addCart, removeFromCart, setCartItems} = cartSlice.actions;
export default cartSlice.reducer;
