import React from 'react';
import { useNavigate } from 'react-router-dom';
import SamsungLogo from '../assets/samsung.png';
import InfinixLogo from '../assets/infinix.png';
import HmdLogo from '../assets/hmd.png';
import TecnoLogo from '../assets/tecno.png';
import AppleLogo from '../assets/apple.jpeg'; // New brand logo
import HuaweiLogo from '../assets/huawel.jpeg'; // New brand logo
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ShopByBrandsBanner = () => {
  const navigate = useNavigate();

  const navigateToBrand = (brandId) => {
    navigate(`/brand/${brandId}`);
  };

  const scrollLeft = () => {
    document.querySelector('.brand-scroll-container').scrollBy({
      left: -150,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    document.querySelector('.brand-scroll-container').scrollBy({
      left: 150,
      behavior: 'smooth',
    });
  };

  return (
    <div className="container mx-auto px-4">
    <div className="bg-gray-800 p-6 rounded-xl shadow-md mt-8">
      {/* Full container wrapping the entire background and logos */}
      <h5 className="text-red-500 text-lg font-semibold mb-4">Exclusive Brand Partners</h5>
     
        {/* Inside container, all content is now centered */}
   
        <div className="relative">
          {/* Horizontal Scroll Wrapper for Small Screens */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-6 md:gap-4 brand-scroll-container">
            {/* Samsung Brand */}
            <div
              onClick={() => navigateToBrand('760af684-7a19-46ab-acc5-7445ef32073a')}
              className="min-w-[100px] md:min-w-0 flex items-center justify-center cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={SamsungLogo} alt="Samsung" className="h-12 md:h-16 w-auto" />
            </div>

            {/* Infinix Brand */}
            <div
              onClick={() => navigateToBrand("c163ee86-1d24-4c97-943b-1f82a09c6066")}
              className="min-w-[100px] md:min-w-0 flex items-center justify-center cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={InfinixLogo} alt="Infinix" className="h-12 md:h-16 w-auto" />
            </div>

            {/* HMD Brand */}
            <div
              onClick={() => navigateToBrand('a85aa52a-2bf9-4fb5-ab36-8cd9bba4baa8')}
              className="min-w-[100px] md:min-w-0 flex items-center justify-center cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={HmdLogo} alt="HMD" className="h-12 md:h-16 w-auto" />
            </div>

            {/* Tecno Brand */}
            <div
              onClick={() => navigateToBrand('86cca959-70a4-448e-86f1-3601309f49a6')}
              className="min-w-[100px] md:min-w-0 flex items-center justify-center cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={TecnoLogo} alt="Tecno" className="h-12 md:h-16 w-auto" />
            </div>

            {/* Apple Brand */}
            <div
              onClick={() => navigateToBrand('brandIdForApple')}
              className="min-w-[100px] md:min-w-0 flex items-center justify-center cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={AppleLogo} alt="Apple" className="h-12 md:h-16 w-auto" />
            </div>

            {/* Huawei Brand */}
            <div
              onClick={() => navigateToBrand('brandIdForHuawei')}
              className="min-w-[100px] md:min-w-0 flex items-center justify-center cursor-pointer bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img src={HuaweiLogo} alt="Huawei" className="h-12 md:h-16 w-auto" />
            </div>
          </div>

          {/* Scroll Arrows for Small Screens */}
          <Button
            icon={<LeftOutlined />}
            shape="circle"
            className="absolute top-1/2 transform -translate-y-1/2 left-2 bg-gray-300 z-10 shadow hover:bg-gray-400 transition-all duration-300 md:hidden"
            onClick={scrollLeft}
          />
          <Button
            icon={<RightOutlined />}
            shape="circle"
            className="absolute top-1/2 transform -translate-y-1/2 right-2 bg-gray-300 z-10 shadow hover:bg-gray-400 transition-all duration-300 md:hidden"
            onClick={scrollRight}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopByBrandsBanner;
