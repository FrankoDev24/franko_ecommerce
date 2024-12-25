// SplashScreen.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/frankoIcon.png';

// Simulate fetching data
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Data fetched for products and showroom");
      resolve();
    }, 2000); // Simulate a 2-second delay for fetching data
  });
};

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
      navigate("/home"); // Redirect to home page after fetching data
    };

    loadData();
  }, [navigate]);

  return (
    <div className="splash-screen">
      <img src={logo} alt="Company Logo" className="logo" />
      <p>Loading products and showroom data...</p>
    </div>
  );
};

export default SplashScreen;
