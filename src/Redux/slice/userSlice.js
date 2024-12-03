import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Async thunk for creating a new user
export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Users/User-Post`, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An unknown error occurred.");
        }
    }
);

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Users/Users-Get`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An unknown error occurred.");
        }
    }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async ({ contact, password }, { dispatch, rejectWithValue }) => {
        try {
            const fetchUsersResult = await dispatch(fetchUsers()).unwrap();

            // Normalize data to handle both `contact` and `contactNumber`
            const normalizedUsers = fetchUsersResult.map((user) => ({
                ...user,
                contact: user.contact || user.contactNumber, // Fallback to contactNumber if contact is not available
            }));

            // Find matching user
            const matchingUser = normalizedUsers.find(
                (user) =>
                    user.contact === contact && user.password === password
            );

            if (matchingUser) {
                // Save user to localStorage
                localStorage.setItem('user', JSON.stringify(matchingUser));
                return matchingUser;
            } else {
                return rejectWithValue("No user found with the provided credentials.");
            }
        } catch (error) {
            return rejectWithValue(error.message || "An unknown error occurred.");
        }
    }
);

// Initial state
const initialState = {
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentUserDetails: null,
    userList: [],
    loading: false,
    error: null,
};

// Create the user slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.currentUser = null;
            state.currentUserDetails = null;
            localStorage.removeItem('user'); // Clear from localStorage on logout
            message.success('Logged out successfully');
        },
        clearUsers: (state) => {
            state.userList = [];
        },
        setUser: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        clearSelectedUser: (state) => {
            state.currentUserDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.ResponseCode === '1') {
                    const newUser = {
                        ...action.meta.arg,
                        ...action.payload,
                    };
                    state.currentUser = newUser;
                    localStorage.setItem('user', JSON.stringify(newUser));
                } else {
                    state.error = "Failed to create user.";
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "An unknown error occurred.";
            })
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.userList = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "An unknown error occurred.";
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.currentUserDetails = action.payload;
                message.success('Logged in successfully!');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed.";
                message.error(`Login failed: ${action.payload}`);
            });
    },
});

// Export the actions
export const { logoutUser, clearUsers, setUser, clearSelectedUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
