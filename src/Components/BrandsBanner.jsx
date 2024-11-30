import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SamsungLogo from '../assets/samsung.png';
import InfinixLogo from '../assets/infinix-logo.png';
import HmdLogo from '../assets/hmd.png';
import TecnoLogo from '../assets/tecno-logo.png';
import AppleLogo from '../assets/apple.jpeg';
import HuaweiLogo from '../assets/huawel.jpeg';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ShopByBrandsBanner = () => {
  const navigate = useNavigate();
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.brand-scroll-container');
    const updateArrowVisibility = () => {
      setShowArrows(container.scrollWidth > container.clientWidth);
    };

    updateArrowVisibility();
    window.addEventListener('resize', updateArrowVisibility);

    return () => window.removeEventListener('resize', updateArrowVisibility);
  }, []);

  const navigateToBrand = (brandId) => {
    navigate(`/brand/${brandId}`);
  };

  const scrollLeft = () => {
    document.querySelector('.brand-scroll-container').scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    document.querySelector('.brand-scroll-container').scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  };

  return (
    <div className="container mx-auto px-2">
 <div className="bg-gradient-to-r from-red-500 to-green-800  p-2 rounded-xl shadow-xl mt-4">

        <h5 className="text-white text-sm md:text-lg font-semibold  p-2 ">Exclusive Brand Partners</h5>

        <div className="relative">
          {/* Conditional Scroll Buttons */}
          {showArrows && (
            <>
              <Button
                icon={<LeftOutlined />}
                shape="circle"
                className="absolute top-1/2 transform -translate-y-1/2 left-2 z-10 bg-gray-300 shadow hover:bg-gray-400 transition-all duration-300"
                onClick={scrollLeft}
              />
              <Button
                icon={<RightOutlined />}
                shape="circle"
                className="absolute top-1/2 transform -translate-y-1/2 right-2 z-10 bg-gray-300 shadow hover:bg-gray-400 transition-all duration-300"
                onClick={scrollRight}
              />
            </>
          )}

          {/* Horizontal Scroll Wrapper */}
          <div className="brand-scroll-container flex gap-4 overflow-x-auto no-scrollbar px-2">
            {[
              { id: '760af684-7a19-46ab-acc5-7445ef32073a', logo: SamsungLogo, name: 'Samsung' },
              { id: 'c163ee86-1d24-4c97-943b-1f82a09c6066', logo: InfinixLogo, name: 'Infinix' },
              { id: 'a85aa52a-2bf9-4fb5-ab36-8cd9bba4baa8', logo: HmdLogo, name: 'HMD' },
              { id: '86cca959-70a4-448e-86f1-3601309f49a6', logo: TecnoLogo, name: 'Tecno' },
              { id: '5c6cf9ae-d44f-42a9-82e5-c82bbf6913cd', logo: AppleLogo, name: 'Apple' },
              { id: 'd643698d-f794-4d33-9237-4a913aa463a2', logo: HuaweiLogo, name: 'Huawei' },
            ].map((brand) => (
              <div
                key={brand.id}
                onClick={() => navigateToBrand(brand.id)}
                className="min-w-[100px] w-[100px] h-[80px] md:w-[220px] md:h-[120px] flex items-center justify-center cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-[100px] h-[80px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByBrandsBanner;
