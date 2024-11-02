import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import your user components
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import Checkout from './Pages/Checkout/Checkout';
import OrderList from './Components/OrderList/OrderList';
import Brand from "./Pages/Brand/Brand";
import ShowRoomProducts from "./Components/ShowRoom/ShowRoomPage";
import ProductDetail from "./Pages/ProductDetails/ProductDetails";
import OrderCycle from "./Pages/Orders/OrderCycle";

// Import admin components
import AdminPage from "./AdminPages/AdminPage";
import AdminLogin from './AdminPages/Login';
import AdminRegister from './AdminPages/Register';
import RegistrationPage from './Pages/SignUp/SignUp';

import CartUpdatePage from './Pages/Cart/CartUpdate';
import LoginPage from './Pages/LogIn/Signin';

const App = () => {
    return (
        <Router>
            <ConditionalNavbar />
            <Routes>
                {/* User routes */}
                <Route path="/" element={<Navigate to="/franko" />} />
                <Route path="/franko" element={<Home />} />
                <Route path='/cart/:transactionNumber' element={<Cart />} />
                <Route path="/checkout/:cartId/:customerId" element={<Checkout />} />
                <Route path="/order" element={<OrderList />} />
                <Route path="/brand/:brandId" element={<Brand />} />
                <Route path="/showroom/:showRoomId" element={<ShowRoomProducts />} />
                <Route path="/sign-up" element={<RegistrationPage />} />
                <Route path='/sign-in' element={<LoginPage />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/order-status" element={<OrderCycle />} />
                <Route path="/cart/update/:cartId/:productId/:quantity" element={<CartUpdatePage />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/*" element={<AdminPage />} />

                {/* Default route redirects */}
                <Route path="/orders" element={<Navigate to="/admin/orders" />} />
                <Route path="/showroom" element={<Navigate to="/admin/showroom" />} />
                <Route path="/categories" element={<Navigate to="/admin/category" />} />
                <Route path="/brand" element={<Navigate to="/admin/brand" />} />
                <Route path="/products" element={<Navigate to="/admin/products" />} />
                <Route path="/users" element={<Navigate to="/admin/users" />} />
                <Route path="/customers" element={<Navigate to="/admin/customers" />} />
            </Routes>
        </Router>
    );
};

// New component to conditionally render the Navbar
const ConditionalNavbar = () => {
    const location = useLocation();

    // Define paths where the Navbar should be hidden
    const hiddenPaths = ['/admin/login', '/admin/register', "/sign-in", "/sign-up"];

    // Check if the current path starts with '/admin/'
    const isAdminPath = location.pathname.startsWith('/admin/');

    return (
        <>
            {/* Render the Navbar only if the current path is not in hiddenPaths and not an admin path */}
            {!hiddenPaths.includes(location.pathname) && !isAdminPath && <Navbar />}
        </>
    );
};

export default App;
