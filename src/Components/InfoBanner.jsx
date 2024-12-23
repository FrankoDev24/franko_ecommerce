import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import blender from "../assets/sam A06.jpg";

const InfoBanner = () => {
  const handleBuyNow = () => {
    window.location.href = "/product/c40f43f4-c50b-43f4-99e2-d36cdaf8989c"; // Update with the actual URL
  };

  return (
    <div className="relative">
      {/* Image Section */}
      <div className="relative h-full  overflow-hidden rounded-lg shadow-lg">
        <img
          src={blender}
          alt="Blender"
          className="w-full h-full object-cover"
        />
        {/* "Buy Now" Button */}
        <button
          onClick={handleBuyNow}
          className="absolute bottom-4 right-4 bg-green-800 text-white font-bold px-4 py-2 sm:px-5 sm:py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          <FaShoppingCart />
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default InfoBanner;
