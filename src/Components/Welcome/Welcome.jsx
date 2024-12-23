import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserPlus, FaTimes } from "react-icons/fa";
import "./Welcome.css";

const Welcome = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleNavigation = (path) => {
    onClose(); // Close the modal
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h1 className="modal-title">🎉 Welcome to Franko Trading! 🎉</h1>
        <p className="modal-message">
          Discover amazing deals and exclusive offers. Sign up now or start shopping!
        </p>
        <div className="modal-buttons">
          <button
            onClick={() => handleNavigation("/sign-up")}
            className="btn btn-primary"
          >
            <FaUserPlus className="btn-icon" />
            Sign Up
          </button>
          <button
            onClick={() => handleNavigation("/home")}
            className="btn btn-secondary"
          >
            <FaShoppingCart className="btn-icon" />
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
