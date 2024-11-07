import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      src={isVisible ? src : ''}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default LazyImage;
