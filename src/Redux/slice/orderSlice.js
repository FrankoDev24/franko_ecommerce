// src/Redux/Slice/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunk for fetching orders by date range
export const fetchOrdersByDate = createAsyncThunk(
  'orders/fetchOrdersByDate',
  async ({ from, to }) => {
    const response = await axios.get(`${API_BASE_URL}/Order/GetOrdersByDate/${from}/${to}`);
    return response.data; // Adjust based on your backend response
  }
);

// Async thunk for checking out an order
export const checkOutOrder = createAsyncThunk(
  'orders/checkOutOrder',
  async ({ cartId, customerId }) => {
    const response = await axios.get(`${API_BASE_URL}/Order/CheckOut/${cartId}/${customerId}`);
    return response.data; // Adjust based on your backend response
  }
);

// Async thunk for updating order transition
export const updateOrderTransition = createAsyncThunk(
  'orders/updateOrderTransition',
  async ({ cycleName, orderId }) => {
    const response = await axios.get(`${API_BASE_URL}/Order/UpdateOrderTransition/${cycleName}/${orderId}`);
    return response.data; // Adjust based on your backend response
  }
);
// Fetch order life cycle
export const fetchOrderLifeCycle = createAsyncThunk(
  'order/fetchLifeCycle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Order/OrderLifeCycle-Get`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk for fetching sales order by ID
export const fetchSalesOrderById = createAsyncThunk(
  'orders/fetchSalesOrderById',
  async (orderId) => {
    const response = await axios.get(`${API_BASE_URL}/Order/SalesOrderGet/${orderId}`);
    return response.data; // Adjust based on your backend response
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
   
    loading: false,
    error: null,
    salesOrder: null, // Add a property to store a single sales order
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
      state.salesOrder = null; // Clear the sales order on reset
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // Store the fetched orders
      })

      .addCase(fetchOrdersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      })
        // Fetch Order Life Cycle
        .addCase(fetchOrderLifeCycle.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchOrderLifeCycle.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.lifeCycle = action.payload;
        })
        .addCase(fetchOrderLifeCycle.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
      .addCase(checkOutOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOutOrder.fulfilled, (state) => {
        state.loading = false;
        // Handle successful checkout, e.g., update orders or store message
      })
      .addCase(checkOutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      })
      .addCase(updateOrderTransition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderTransition.fulfilled, (state) => {
        state.loading = false;
        // Handle successful transition update, e.g., update the state or orders
      })
      .addCase(updateOrderTransition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      })
      .addCase(fetchSalesOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrder = action.payload; // Store the fetched sales order
      })
      .addCase(fetchSalesOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Capture error message
      });
  },
});

// Export the action to clear orders
export const { clearOrders } = orderSlice.actions;

// Export the reducer
export default orderSlice.reducer;
