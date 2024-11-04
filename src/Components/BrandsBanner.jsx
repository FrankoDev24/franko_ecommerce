import React from 'react';
import { useNavigate } from 'react-router-dom';
import SamsungLogo from '../assets/samsung.png';
import InfinixLogo from '../assets/infinix.png';
import HmdLogo from '../assets/hmd.png';
import TecnoLogo from '../assets/tecno.png';

const ShopByBrandsBanner = () => {
  const navigate = useNavigate();

  // Redirect function with corrected path
  const navigateToBrand = (brandId) => {
    navigate(`/brand/${brandId}`);
  };

  return (
    <div className="bg-gray-300 p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold text-red-500 mb-6">
        Shop by Brands
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Samsung Brand */}
        <div
          onClick={() => navigateToBrand('760af684-7a19-46ab-acc5-7445ef32073a')}
          className="flex items-center justify-center cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
        >
          <img src={SamsungLogo} alt="Samsung" className="h-16 w-auto" />
        </div>

        {/* Infinix Brand */}
        <div
          onClick={() => navigateToBrand("c163ee86-1d24-4c97-943b-1f82a09c6066")}
          className="flex items-center justify-center cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
        >
          <img src={InfinixLogo} alt="Infinix" className="h-16 w-auto" />
        </div>

        {/* HMD Brand */}
        <div
          onClick={() => navigateToBrand('a85aa52a-2bf9-4fb5-ab36-8cd9bba4baa8')}
          className="flex items-center justify-center cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
        >
          <img src={HmdLogo} alt="HMD" className="h-16 w-auto" />
        </div>

        {/* Tecno Brand */}
        <div
          onClick={() => navigateToBrand('86cca959-70a4-448e-86f1-3601309f49a6')}
          className="flex items-center justify-center cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
        >
          <img src={TecnoLogo} alt="Tecno" className="h-16 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default ShopByBrandsBanner;
