import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import components
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import Checkout from './Pages/Checkout/Checkout';
import Brand from "./Pages/Brand/Brand";
import ShowRoomProducts from "./Components/ShowRoom/ShowRoomPage";
import ProductDetail from "./Pages/ProductDetails/ProductDetails";
import OrderCycle from "./Pages/Orders/OrderCycle";
import RegistrationPage from './Pages/SignUp/SignUp';
import CartUpdatePage from './Pages/Cart/CartUpdate';
import LoginPage from './Pages/LogIn/Signin';
import ProductsPage from './Pages/AllProducts';
import OrderHistory from './Pages/OrderHistory/OrderHistory';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import Policies from './Pages/Policy';
import Footer from './Components/Footer/Footer';
import UserProfile from './Pages/Profile';

// Agent-specific imports
import AdminLogin from './AdminPages/Login';
import AdminRegister from './AdminPages/Register';
import AdminPage from "./AdminPages/AdminPage";
import AgentHome from './Agents/AgentHome';
import AgentOrders from './Agents/AgentPage/AgentOrders';
import AgentDashboard from './Agents/AgentPage/AgentDashboard';
import OrderSuccess from './Pages/OrderSuccessPage';
import OrderReceived from './Pages/OrderReceived';

// Utility to simulate authentication
// Utility to get the user's role from the accountType field in the customer object in local storage
const getUserRole = () => {
    try {
        const customer = JSON.parse(localStorage.getItem('customer'));
        return customer?.accountType || null; // 'customer', 'agent', or 'admin'
    } catch (error) {
        console.error("Error parsing customer data from localStorage:", error);
        return null;
    }
};

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = getUserRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect unauthorized users to the login page
        return <Navigate to="/" replace />;
    }
    return children;
};


const App = () => {
    return (
        <Router>
            <ConditionalNavbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/franko" />} />
                <Route path="/franko" element={<Home />} />
                <Route path='/cart/:transactionNumber' element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/brand/:brandId" element={<Brand />} />
                <Route path="/showroom/:showRoomID" element={<ShowRoomProducts />} />
                <Route path="/sign-up" element={<RegistrationPage />} />
                <Route path='/sign-in' element={<LoginPage />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/order-status" element={<OrderCycle />} />
                <Route path="/cart/update/:cartId/:productId/:quantity" element={<CartUpdatePage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Policies />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path = "/order-success/:orderId" element={<OrderSuccess />} />
         <Route path ="order-received" element={<OrderReceived />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/*" element={<AdminPage />} />

                {/* Agent Routes */}
                <Route
        path="/agent-dashboard"
        element={
          <ProtectedRoute allowedRoles={['agent']}>
            <AgentHome>
              <AgentDashboard />  {/* This renders inside AgentHome when /agent-dashboard is visited */}
            </AgentHome>
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent-dashboard/orders"
        element={
          <ProtectedRoute allowedRoles={['agent']}>
            <AgentHome>
              <AgentOrders />  {/* This renders inside AgentHome when /agent-dashboard/orders is visited */}
            </AgentHome>
          </ProtectedRoute>
        }
      />
      
                {/* Default route redirects */}
                <Route path="*" element={<Navigate to="/franko" />} />
            </Routes>

            <ConditionalFooter />
        </Router>
    );
};

// Navbar and Footer Components
const ConditionalNavbar = () => {
    const location = useLocation();
    const hiddenPaths = ['/admin/login', '/admin/register', '/sign-in', '/sign-up'];
    const isAdminPath = location.pathname.startsWith('/admin/');


    return !hiddenPaths.includes(location.pathname) && !isAdminPath  && <Navbar />;
};

const ConditionalFooter = () => {
    const location = useLocation();
    const hiddenPaths = ['/admin/login', '/admin/register', '/sign-in', '/sign-up'];
    const isAdminPath = location.pathname.startsWith('/admin/');
    const isAgentPath = location.pathname.startsWith('/agent-dashboard');
    return !hiddenPaths.includes(location.pathname) && !isAdminPath && !isAgentPath && <Footer />;
};

export default App;
