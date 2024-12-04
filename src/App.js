import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Import components
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import Brand from "./Pages/Brand/Brand";
import ShowRoomProducts from "./Components/ShowRoom/ShowRoomPage";
import ProductDetail from "./Pages/ProductDetails/ProductDetails";
import OrderCycle from "./Pages/Orders/OrderCycle";
import RegistrationPage from "./Pages/SignUp/SignUp";
import CartUpdatePage from "./Pages/Cart/CartUpdate";
import LoginPage from "./Pages/LogIn/Signin";
import ProductsPage from "./Pages/AllProducts";
import OrderHistory from "./Pages/OrderHistory/OrderHistory";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Policies from "./Pages/Policy";

import UserProfile from "./Pages/Profile";

// Agent-specific imports
import AdminLogin from "./AdminPages/Login";
import AdminRegister from "./AdminPages/Register";
import AdminPage from "./AdminPages/AdminPage";
import AgentHome from "./Agents/AgentHome";
import AgentOrders from "./Agents/AgentPage/AgentOrders";
import AgentDashboard from "./Agents/AgentPage/AgentDashboard";
import OrderSuccess from "./Pages/OrderSuccessPage";
import OrderReceived from "./Pages/OrderReceived";
import NoInternetPage from "./Pages/NoInternet";
import ContentPage from "./ContentManager/ContentPage";
import ContentDashboard from "./ContentManager/ContentManager/ContentDashboard";
import Products from "./ContentManager/ContentManager/Products";
import Brands from "./ContentManager/ContentManager/Brands";
import Category from "./ContentManager/ContentManager/Category";
import Showroom from "./ContentManager/ContentManager/Showroom";
import FulfillmentPage from "./Fufilments/Fufilments/FulfillmentsPage";
import FulfillmentsDashboard from "./Fufilments/Fufilments/FulfillmentsDashboard";
import FulfillmentsOrder from "./Fufilments/Fufilments/FulfillmentsOrder";
import Dashboard from "./AdminPages/Dashboard";
import Cancellation from "./Pages/Cancellation";

// Utility to fetch customer role
const getUserRole = () => {
  try {
    const customer = JSON.parse(localStorage.getItem("customer"));
    const user = JSON.parse(localStorage.getItem("user"));
    if (!customer && !user) {
      return <Navigate to="/admin/register" replace />;
    }
    // First, check user position from the user object, if exists
    if (user && user.position) {
      return user.position; // e.g., 'Supervisor', 'Webcontentmanager', 'Fulfillment'
    }
    
    // If the user object doesn't have a position, fallback to the customer object
    return customer?.accountType || null; // 'customer', 'agent', or 'admin'
  } catch (error) {
    console.error("Error parsing customer or user data from localStorage:", error);
    return null;
  }
};

const getUserPosition = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.position || null; // e.g., 'Supervisor', 'Webcontentmanager', 'Fulfillment'
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};


// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = getUserRole();
  const userPosition = getUserPosition();

  // Check user position and redirect accordingly (if position exists in the user object)
if (userPosition) {
  if (userPosition === "Supervisor") {
    // Render AdminPage directly for Supervisor
    return <AdminPage />;
  } else if (userPosition === "Webcontentmanager") {
    return <ContentPage />;
  } else if (userPosition === "Fulfillment") {
    return <FulfillmentPage />;
  }
}


  // If no userPosition is found, check the role-based redirection (from userRole)
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // If the user is authorized, render the children
  return children;
};

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <NoInternetPage />; // Render NoInternetPage if offline
  }
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/franko" />} />
        <Route path="/franko" element={<Home />} />
        <Route path="/cart/:transactionNumber" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/brand/:brandId" element={<Brand />} />
        <Route path="/showroom/:showRoomID" element={<ShowRoomProducts />} />
        <Route path="/sign-up" element={<RegistrationPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/order-status" element={<OrderCycle />} />
        <Route
          path="/cart/update/:cartId/:productId/:quantity"
          element={<CartUpdatePage />}
        />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Policies />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="order-received" element={<OrderReceived />} />
        <Route path="order-cancelled" element={<Cancellation/> } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        
        <Route 
  path="/admin/*" 
  element={
    <ProtectedRoute allowedRoles={['admin', 'Supervisor']} >
      <AdminPage >
        <Dashboard/>
        </AdminPage>
    </ProtectedRoute>
  } 
/>

        {/* Agent Routes */}
        <Route
          path="/agent-dashboard"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <AgentHome>
                <AgentDashboard />{" "}
                {/* This renders inside AgentHome when /agent-dashboard is visited */}
              </AgentHome>
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent-dashboard/orders"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <AgentHome>
                <AgentOrders />{" "}
                {/* This renders inside AgentHome when /agent-dashboard/orders is visited */}
              </AgentHome>
            </ProtectedRoute>
          }
        />
       
       {/* Content Manager Routes */}
      <Route
        path="/content/*"
        element={
          <ProtectedRoute allowedRoles={['Webcontentmanager']}>
            <ContentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/products"
        element={
          <ProtectedRoute allowedRoles={['Webcontentmanager']}>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/brands"
        element={
          <ProtectedRoute allowedRoles={['Webcontentmanager']}>
            <Brands />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/category"
        element={
          <ProtectedRoute allowedRoles={['Webcontentmanager']}>
            <Category />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/showroom"
        element={
          <ProtectedRoute allowedRoles={['Webcontentmanager']}>
            <Showroom />
          </ProtectedRoute>
        }
      />

      {/* Fulfillment Routes */}
      <Route
        path="/fulfillment/*"
        element={
          <ProtectedRoute allowedRoles={['Fulfillment']}>
            <FulfillmentsDashboard />
          </ProtectedRoute>
        }
      />
       <Route
        path="/fulfillment/orders"
        element={
          <ProtectedRoute allowedRoles={['Fulfillment']}>
            <FulfillmentsOrder />
          </ProtectedRoute>
        }
      />
      
        {/* Default route redirects */}
        <Route path="*" element={<Navigate to="/franko" />} />
      </Routes>

   
    </Router>
  );
};

// Navbar and Footer Components
const ConditionalNavbar = () => {
  const location = useLocation();
  const hiddenPaths = [
    "/admin/login",
    "/admin/register",
    "/sign-in",
    "/sign-up",
    "/content/dashboard",
    "/content/products",
    "/content/showroom",
    "/content/brands",
    "/content/category",
    "/fulfillment/dashboard",
    "/fulfillment/orders",
  ];
  const isAdminPath = location.pathname.startsWith("/admin/");

  return !hiddenPaths.includes(location.pathname) && !isAdminPath && <Navbar />;
};


export default App;
