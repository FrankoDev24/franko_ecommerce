import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunk for creating a new customer
export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Users/Customer-Post`, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An unknown error occurred.");
    }
  }
);

// Async thunk for fetching all customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Users/Customer-Get`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An unknown error occurred.");
    }
  }
);

// Async thunk for customer login
export const loginCustomer = createAsyncThunk(
  'customers/loginCustomer',
  async ({ contact_number, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Users/CustomerLogin`);

      if (response.data.ResponseCode === '1') {
        // Login successful, now fetch all customers to get detailed information
        const fetchCustomersResult = await dispatch(fetchCustomers());

        if (fetchCustomersResult.payload) {
          // Find the customer with matching contact_number and password
          const matchingCustomer = fetchCustomersResult.payload.find(
            (customer) => customer.contact_number === contact_number && customer.password === password
          );

          if (matchingCustomer) {
            // Return both login response and the matching customer details
            return { ...response.data, customerDetails: matchingCustomer };
          }
        }
      }
      return response.data; // Return only the response data if no matching customer is found
    } catch (error) {
      return rejectWithValue(error.response?.data || "An unknown error occurred.");
    }
  }
);

// Initial state
const initialState = {
  currentCustomer: JSON.parse(localStorage.getItem('customer')) || null,
  selectedCustomer: null,
  customerList: [],
  loading: false,
  error: null,
  currentCustomerDetails: null, // This will store the customer details
};

// Create the customer slice
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    logoutCustomer: (state) => {
      state.currentCustomer = null;
      state.currentCustomerDetails = null;
    },
    clearCustomers: (state) => {
      state.customerList = [];
    },
    setCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.ResponseCode === '1') {
          const newCustomer = {
            ...action.meta.arg,
            ...action.payload,
          };
          state.currentCustomer = newCustomer;
          localStorage.setItem('customer', JSON.stringify(newCustomer));
        } else {
          state.error = "Failed to create customer.";
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred.";
      })
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred.";
      })
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.ResponseCode === '1') {
          const customerDetails = action.payload.customerDetails || action.payload;
          state.currentCustomer = customerDetails;
          state.currentCustomerDetails = customerDetails;

          localStorage.setItem('customer', JSON.stringify(customerDetails));
        } else {
          state.error = "Login failed.";
        }
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred.";
      });
  },
});

// Export the actions
export const { logoutCustomer, clearCustomers, setCustomer, clearSelectedCustomer } = customerSlice.actions;

// Export the reducer
export default customerSlice.reducer;
