import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slice/categorySlice'; // Adjust the path based on your file structure
import brandReducer from './slice/brandSlice'; // Import the brand slice reducer
import productReducer from './slice/productSlice'; // Import the product slice reducer
import showroomReducer from './slice/showRoomSlice'; // Import the showroom slice reducer
import orderReducer from './slice/orderSlice'; // Import the order slice reducer
import userReducer from './slice/userSlice'; // Import the user slice reducer
import customerReducer from './slice/customerSlice'; //
import cartReducer from './slice/cartSlice';
import shippingReducer from './slice/shippingSlice';
export const store = configureStore({
  reducer: {
    categories: categoryReducer, // Add the category slice reducer here
    brands: brandReducer,        // Add the brand slice reducer here
    products: productReducer,    // Add the product slice reducer here
    showrooms: showroomReducer,  // Add the showroom slice reducer here
    orders: orderReducer,        // Add the order slice reducer here
    user: userReducer,          
    customer: customerReducer,
    cart: cartReducer,
    shipping: shippingReducer

           
  },
});
