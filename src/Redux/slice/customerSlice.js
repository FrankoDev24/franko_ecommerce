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
  async ({ contact_number, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Users/CustomerLogin/${contact_number}/${password}`);
      return response.data; // Return the response data directly
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
    // Clear customer data when logging out
    logoutCustomer: (state) => {
      state.currentCustomer = null; // Clear the current customer
      state.currentCustomerDetails = null; // Clear customer details
      localStorage.removeItem('customer'); // Clear customer data from local storage on logout
    },
    clearCustomers: (state) => {
      state.customerList = []; // Reset the customer list
    },
    setCustomer: (state, action) => {
      state.selectedCustomer = action.payload; // Set the selected customer details
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null; // Clear the selected customer details
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle creating a customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.ResponseCode === '1') {
          const newCustomer = {
            ...action.meta.arg, // Merge with the original customer details
            ...action.payload // Include the response from the API
          };

          state.currentCustomer = newCustomer; // Store the newly created customer as currentCustomer
          localStorage.setItem('customer', JSON.stringify(newCustomer)); // Store the customer data in local storage
        } else {
          state.error = "Failed to create customer.";
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred.";
      })
      // Handle fetching all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred.";
      })
      // Handle customer login
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;

        // Store the customer data in state
        if (action.payload && action.payload.ResponseCode === '1') {
          const customerDetails = action.payload; // Fetch customer details based on login
          state.currentCustomer = customerDetails; // Update current customer with login details
          state.currentCustomerDetails = customerDetails; // Store customer details

          // Store the customer data in local storage
          localStorage.setItem('customer', JSON.stringify(customerDetails)); // Store customer details on login
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
