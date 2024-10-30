import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Utility Functions
const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Initial State
const initialState = {
  cart: loadCartFromLocalStorage(),
  totalItems: loadCartFromLocalStorage().reduce((total, item) => total + item.quantity, 0),
  transactionNumber: localStorage.getItem('transactionNumber') || uuidv4(),
  loading: false,
  error: null,
};

// Async Thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      // Get or set transaction number
      let transactionNumber = localStorage.getItem('transactionNumber');
      if (!transactionNumber || transactionNumber === 'undefined') {
        transactionNumber = uuidv4();
        localStorage.setItem('transactionNumber', transactionNumber);
      }

      const cartItem = {
        transactionNumber,
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
      };

      const response = await axios.post('https://api.salesmate.app/Cart/Add-To-Cart', cartItem);
      return { ...cartItem, ...response.data }; 
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getCartById = createAsyncThunk(
  'cart/getCartById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://api.salesmate.app/Cart/Cart-GetbyID/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://api.salesmate.app/Cart/Cart-Update/${cartId}/${productId}/${quantity}`
      );
      return response.data; // Assuming the backend returns the updated data
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);



export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      await axios.post(`https://api.salesmate.app/Cart/Cart-Delete/${cartId}/${productId}`);
      return { cartId, productId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, action) => {
      const itemIndex = state.cart.findIndex((item) => item.productId === action.payload.productId);
      if (itemIndex >= 0) {
        state.cart[itemIndex].quantity += action.payload.quantity;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
      state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
      saveCartToLocalStorage(state.cart);
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cart.findIndex((item) => item.productId === action.payload.productId);
      if (itemIndex >= 0) {
        state.totalItems -= state.cart[itemIndex].quantity;
        state.cart.splice(itemIndex, 1);
        saveCartToLocalStorage(state.cart);
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.transactionNumber = uuidv4();
      localStorage.setItem('transactionNumber', state.transactionNumber);
      localStorage.removeItem('cart');
    },
    setCartItems(state, action) {
      state.cart = action.payload;
      state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
      saveCartToLocalStorage(state.cart);
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const existingItemIndex = state.cart.findIndex(item => item.productId === action.payload.productId);
        if (existingItemIndex >= 0) {
          state.cart[existingItemIndex].quantity += action.payload.quantity;
        } else {
          state.cart.push(action.payload);
        }
        state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        saveCartToLocalStorage(state.cart);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getCartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartById.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.totalItems = action.payload.reduce((total, item) => total + item.quantity, 0);
        state.loading = false;
        saveCartToLocalStorage(state.cart);
      })
      .addCase(getCartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        console.log('State before update:', JSON.parse(JSON.stringify(state)));
        console.log('Update action payload:', action.payload);
  
        const { cartId, productId, quantity } = action.payload; // Assuming your payload contains these properties
        const itemIndex = state.cart.findIndex(item => item.productId === productId && item.transactionNumber === cartId);
  
        if (itemIndex !== -1) {
          state.cart[itemIndex].quantity = quantity; // Update the quantity
          console.log(`Updated product ${productId} quantity to ${quantity}`);
        } else {
          console.error('Product not found in cart with cartId:', cartId); // Log if product is not found
        }
  
        // Update total items
        state.totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
        
        saveCartToLocalStorage(state.cart);
        console.log('State after update:', JSON.parse(JSON.stringify(state)));
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the deleted item from the cart
        state.cart = state.cart.filter(item => item.productId !== action.payload.productId);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },

});

export const { clearCart, addCart, removeFromCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
