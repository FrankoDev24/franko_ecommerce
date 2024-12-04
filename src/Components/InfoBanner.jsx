import React from "react";
import blender from "../assets/blender.png";

const InfoBanner = () => {
  const handleBuyNow = () => {
    window.location.href = "/product/c40f43f4-c50b-43f4-99e2-d36cdaf8989c"; // Update with the actual URL
  };

  return (
    <div className="relative bg-gradient-to-r from-red-200  to-green-100 py-6 px-4 sm:px-12 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
        {/* Text Section */}
        <div className="flex-1 text-left">
          <h2 className="text-md font-bold text-gray-800">
            Appliances <span className="text-red-500">Special Offer</span>
          </h2>
          <p className="text-sm md:text-md font-medium text-gray-600 mt-3">
            Best Selling Products
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Find out about our deals of the day and make your life easier with
            top-quality blenders.
          </p>
          <button
            onClick={handleBuyNow}
            className="mt-5 bg-red-600 text-white font-semibold text-sm  px-2 py-2 sm:px-6 rounded-full shadow-md"
          >
            Buy Now
          </button>
        </div>

       {/* Image Section */}
<div className="flex-1 flex justify-center relative">
  <div className="relative inline-block">
    <img
      src={blender}
      alt="Blender"
      className="w-32 mx-auto"
    />
    {/* Discount Badge */}
    <div className="absolute top-0 right-2 bg-red-500 text-white text-center px-2 py-1 rounded-full shadow-md">
      <span className="block text-xs">14%</span>
      <span className="block text-xs">OFF</span>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default InfoBanner;
