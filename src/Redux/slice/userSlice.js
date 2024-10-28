import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


// User registration (POST /Users/User-Post)
export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue, dispatch }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Users/User-Post`, userData);
        
        // Save user details in localStorage
        localStorage.setItem('userDetails', JSON.stringify(response.data));

        // Dispatch setUser to update Redux state
        dispatch(setUser(response.data)); // Set user details in Redux

        return response.data; // Assuming the API returns user data upon successful registration
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// User login (POST /Users/LogIn/{Contact_number}/{password})
export const loginUser = createAsyncThunk('user/loginUser', async ({ contactNumber, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Users/LogIn/${contactNumber}/${password}`);

        // Assuming response.data.user includes the full name
        return {
            token: response.data.token,
            user: { ...response.data.user }  // Directly using response user data
        };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// New async thunk for getting all users
export const getUsers = createAsyncThunk('user/getUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Users/Users-Get`); // Adjust API endpoint to fetch all users
        return response.data; // Assuming the API returns a list of users
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    users: [], // Store all users
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.users = []; // Clear users on logout
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userDetails');
            message.success('Logged out successfully');
        },
        setUser: (state, action) => {
            state.user = action.payload; // Set user details in Redux state
            localStorage.setItem('user', JSON.stringify(action.payload)); // Store user in localStorage
        }
    },
    extraReducers: (builder) => {
        builder
            // Registration
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Store the user details in state
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;  // Full user details including full name
                state.token = action.payload.token;
                
                // Store the user and token in localStorage
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Users
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload; // Store fetched users
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
