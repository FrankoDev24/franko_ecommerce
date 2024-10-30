import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// User registration
export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue, dispatch }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Users/User-Post`, userData);

        // Store user details in localStorage and Redux state
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(setUser(response.data));

        return response.data; // Assuming the API returns full user data
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// User login
export const loginUser = createAsyncThunk('user/loginUser', async ({ contactNumber, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Users/LogIn/${contactNumber}/${password}`);

        const userData = { token: response.data.token, user: response.data.user };
        
        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(userData.user));
        localStorage.setItem('token', userData.token);

        return userData;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Get all users
export const getUsers = createAsyncThunk('user/getUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Users/Users-Get`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    users: [],
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
            state.users = [];
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            message.success('Logged out successfully');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
