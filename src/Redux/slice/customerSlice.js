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
      return { ...response.data, customerData }; // Return both the response data and the input data
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
      return response.data; // Return the data directly
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
      const response = await axios.get(`${API_BASE_URL}/Users/CustomerLogin/${contact_number}/${password}`);
      return response.data; // Assuming the response contains the logged-in customer data
    } catch (error) {
      return rejectWithValue(error.response?.data || "An unknown error occurred.");
    }
  }
);

// Initial state
const initialState = {
  currentCustomer: undefined, // Stores logged-in customer
  selectedCustomer: null, // Track the selected customer
  customerList: [], // Initialize customer list
  loading: false,
  error: null,
};

// Create the customer slice
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Clear customer data when logging out
    logoutCustomer: (state) => {
      state.currentCustomer = null; // Clear the current customer
      localStorage.removeItem('customer'); // Clear customer data from local storage on logout
    },
    clearCustomers: (state) => {
      state.customerList = []; // Correctly reset the customer list
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

        // Log the action for debugging
        console.log('Create Customer Fulfilled:', action.payload);

        // Check for the response code
        if (action.payload.ResponseCode === '1') {
          const newCustomer = action.payload.customerData; // Use the customerData passed to the thunk
          state.currentCustomer = newCustomer; // Store the newly created customer as currentCustomer
          localStorage.setItem('customer', JSON.stringify(newCustomer)); // Store the customer data in local storage
        }
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred."; // Capture error message
        console.error('Create Customer Rejected:', action.error); // Log error for debugging
      })
      // Handle fetching all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = action.payload; // Store the fetched customers in customerList
        console.log('Customers Fetched:', action.payload); // Log the customers fetched
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred."; // Capture error message
        console.error('Fetch Customers Rejected:', action.error); // Log error for debugging
      })
      // Handle customer login
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload; // Store the logged-in customer
        
        // Store the customer data in local storage
        localStorage.setItem('customer', JSON.stringify(action.payload)); // Store customer details on login
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An unknown error occurred."; // Capture error message
        console.error('Login Customer Rejected:', action.error); // Log error for debugging
      });
  },
});

// Export the actions
export const { logoutCustomer, clearCustomers, setCustomer, clearSelectedCustomer } = customerSlice.actions;

// Export the reducer
export default customerSlice.reducer;
