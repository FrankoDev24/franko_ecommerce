import React from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import carousleimage from  "../../assets/hero_endframe__cvklg0xk3w6e_large 2.png"

const ProductCarousel = () => {
  const carouselRef = React.useRef();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const slides = [
    {
      title: "iPhone 16",
      subtitle: "Hello, Apple Intelligence.",
      specs: ["16 Pro | 16 Pro Max", "256GB | 512GB"],
      buttonText: "Available Now",
      image: carousleimage, // Replace with your image
      backgroundColor: "bg-gradient-to-r from-gray-100 to-gray-200"
    },
    // Add more slides as needed
  ];

  return (
    <div className="relative w-full">
      {/* Custom Navigation Buttons */}
      <button 
        onClick={() => carouselRef.current.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 rounded-full p-2"
        aria-label="Previous slide"
      >
        <LeftOutlined className="text-2xl text-black" />
      </button>
      
      <button 
        onClick={() => carouselRef.current.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 rounded-full p-2"
        aria-label="Next slide"
      >
        <RightOutlined className="text-2xl text-black" />
      </button>

      <Carousel ref={carouselRef} {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className={`${slide.backgroundColor} relative`}>
            <div className="container mx-auto px-4 py-12 flex items-center min-h-[400px]">
              <div className="grid grid-cols-2 gap-8 items-center">
                {/* Text Content */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold">{slide.title}</h2>
                    <p className="text-2xl">{slide.subtitle}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {slide.specs.map((spec, i) => (
                      <div key={i} className="inline-block bg-black text-white rounded-full px-4 py-1 mr-2">
                        {spec}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#B0A49B]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#555555]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#F5E0DA]"></div>
                  </div>

                  <Button type="primary" className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90">
                    {slide.buttonText}
                  </Button>
                </div>

                {/* Image */}
                <div className="flex justify-end">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="max-w-[80%] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;