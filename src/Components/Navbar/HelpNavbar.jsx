import React from 'react';
import { PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';

const HelpNavbar = () => {
  return (
    <div className="bg-green-600 py-1">
      <div className="container mx-auto px-2 flex justify-center items-center">
        <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-2 md:space-y-0">
          {/* Help Text */}
          <p className="text-white text-xs md:text-sm font-semibold text-center md:text-left">
            Need Help? Contact Us!
          </p>

          {/* Phone Icon and Number */}
          <div className="flex items-center justify-center md:justify-start gap-10">
          <p className="text-white text-sm md:text-sm flex items-center justify-center md:justify-start">
            <PhoneOutlined className="mr-2" />
            <a href="tel:+233302225651" className="text-white">+233302225651 </a>
          </p>

          {/* WhatsApp Icon and Number */}
          <p className="text-white text-sm md:text-sm flex items-center justify-center md:justify-start">
            <WhatsAppOutlined className="mr-2" />
            <a href="https://wa.me/+233555939311" target="_blank" rel="noopener noreferrer" className="text-white">+233555939311</a>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HelpNavbar;
