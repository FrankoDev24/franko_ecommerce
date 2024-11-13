// src/Redux/Slice/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunks
export const fetchOrdersByDate = createAsyncThunk(
  "orders/fetchOrdersByDate",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Order/GetOrdersByDate/${from}/${to}`
      );
      return response.data; // Ensure this returns the expected data format
    } catch (error) {
      console.error("Error fetching orders by date:", error); // Log the error for debugging
      return rejectWithValue(
        error.response?.data || "Failed to fetch orders by date"
      );
    }
  }
);

export const checkOutOrder = createAsyncThunk(
  "orders/checkOutOrder",
  async ({ cartId, customerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Order/CheckOut/${cartId}/${customerId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to checkout order"
      );
    }
  }
);

export const updateOrderTransition = createAsyncThunk(
  "orders/updateOrderTransition",
  async ({ cycleName, orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Order/UpdateOrderTransition/${cycleName}/${orderId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order transition"
      );
    }
  }
);

export const fetchOrderLifeCycle = createAsyncThunk(
  "orders/fetchOrderLifeCycle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Order/OrderLifeCycle-Get`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order lifecycle"
      );
    }
  }
);

export const fetchSalesOrderById = createAsyncThunk(
  "orders/fetchSalesOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Order/SalesOrderGet/${orderId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch sales order"
      );
    }
  }
);

export const updateOrderDelivery = createAsyncThunk(
  "orders/updateOrderDelivery",
  async (orderCode, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Order/OrderDeliveryUpdate/${orderCode}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order delivery"
      );
    }
  }
);

export const orderAddress = createAsyncThunk(
  "orders/OrderAddress",
  async (
    { customerId, orderCode, address, geoLocation },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Order/OrderAddress`, {
        customerid: customerId,
        orderCode: orderCode,
        address: address,
        geoLocation: geoLocation,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order address"
      );
    }
  }
);
export const fetchOrderDeliveryAddress = createAsyncThunk(
  "orders/fetchOrderDeliveryAddress",
  async (orderCode, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Order/GetOrderDeliveryAddress/${orderCode}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch delivery address"
      );
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    salesOrder: null,
    lifeCycle: null,
    deliveryAddress: null,
    deliveryUpdate: null,
    loading: {
      orders: false,
      salesOrder: false,
      lifeCycle: false,
      deliveryAddress: false,
      deliveryUpdate: false,
    },
    error: {
      orders: null,
      salesOrder: null,
      lifeCycle: null,
      deliveryAddress: null,
      deliveryUpdate: null,
    },
  },
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.salesOrder = null;
      state.lifeCycle = null;
      state.deliveryAddress = null;
      state.deliveryUpdate = null;
      state.error = {};
      state.loading = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // or whatever your payload structure is
      })
      .addCase(fetchOrdersByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error; // Store error information
      })

      // Handle updateOrderTransition similarly
      .addCase(updateOrderTransition.pending, (state) => {
        state.loading = true;
        state.error.orders = null;
      })
      .addCase(updateOrderTransition.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload; // Ensure `payload` is an order object
        const index = state.orders.findIndex(
          (order) => order.orderId === updatedOrder.orderId
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder; // Update the order in place
        }
      })
      .addCase(updateOrderTransition.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload; // Capture error message
      })

      .addCase(fetchOrderLifeCycle.pending, (state) => {
        state.loading.lifeCycle = true;
        state.error.lifeCycle = null;
      })
      .addCase(fetchOrderLifeCycle.fulfilled, (state, action) => {
        state.loading.lifeCycle = false;
        state.lifeCycle = action.payload;
      })
      .addCase(fetchOrderLifeCycle.rejected, (state, action) => {
        state.loading.lifeCycle = false;
        state.error.lifeCycle = action.payload;
      })

      .addCase(checkOutOrder.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(checkOutOrder.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders = action.payload;
      })
      .addCase(checkOutOrder.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })

      .addCase(fetchSalesOrderById.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      .addCase(fetchSalesOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrder = action.payload; // Ensure salesOrder gets proper data
      })
      .addCase(fetchSalesOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error; // Capture error message
        state.salesOrder = null; // Reset salesOrder on error
      })
      .addCase(orderAddress.pending, (state) => {
        state.loading.deliveryAddress = true;
        state.error.deliveryAddress = null;
      })
      .addCase(orderAddress.fulfilled, (state, action) => {
        state.loading.deliveryAddress = false;
        state.deliveryAddress = action.payload; // Optionally, you may want to store the updated address here
      })
      .addCase(orderAddress.rejected, (state, action) => {
        state.loading.deliveryAddress = false;
        state.error.deliveryAddress = action.payload;
      })

      .addCase(fetchOrderDeliveryAddress.pending, (state) => {
        state.loading.deliveryAddress = true;
        state.error.deliveryAddress = null;
      })
      .addCase(fetchOrderDeliveryAddress.fulfilled, (state, action) => {
        state.loading.deliveryAddress = false;
        state.deliveryAddress = action.payload;
      })
      .addCase(fetchOrderDeliveryAddress.rejected, (state, action) => {
        state.loading.deliveryAddress = false;
        state.error.deliveryAddress = action.payload;
      })

      .addCase(updateOrderDelivery.pending, (state) => {
        state.loading.deliveryUpdate = true;
        state.error.deliveryUpdate = null;
      })
      .addCase(updateOrderDelivery.fulfilled, (state, action) => {
        state.loading.deliveryUpdate = false;
        state.deliveryUpdate = action.payload;
      })
      .addCase(updateOrderDelivery.rejected, (state, action) => {
        state.loading.deliveryUpdate = false;
        state.error.deliveryUpdate = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
