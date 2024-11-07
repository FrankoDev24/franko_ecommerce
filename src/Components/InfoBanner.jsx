import React from 'react';
import call from "../assets/callcenter.jpg";


const InfoBanner = () => {
  return (
    <div className="container mx-auto bg-black text-white p-4 md:p-6 flex flex-col md:flex-row items-center justify-between rounded-lg">
      
  
      
      
      {/* Text Section */}
      <div className="flex-1 text-center md:text-left md:ml-8 space-y-2 md:space-y-3">
        <h1 className="text-xl md:text-3xl font-bold leading-tight">
          BLACK <span className="text-red-500"> FRIDAY</span>
        </h1>
        <span className="bg-red-500 text-black px-3 py-1 rounded-full text-xs md:text-sm">ON</span>
        <p className="text-sm md:text-lg font-light">
          01 - 29 NOV
        </p>
        <p className="text-xs md:text-base mt-2">
          Need help placing an order? Call
        </p>
        <p className="text-lg md:text-2xl font-bold text-red-500">
          <a href="tel:0302740642" className="hover:underline">
            024 642 2338
          </a>
        </p>
        <p className="text-xs md:text-sm font-light">English or Twi, we speak your language</p>
      </div>

      {/* Image Section */}
      <div className="flex items-center justify-center mt-4 md:mt-0 md:ml-6">
        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg">
          <img
            src={call}
            alt="Customer Service"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
