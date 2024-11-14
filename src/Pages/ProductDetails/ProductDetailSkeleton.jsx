import React from 'react';

const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 bg-gray-200 h-80 rounded-lg shadow-lg"></div>

        {/* Info skeleton */}
        <div className="lg:w-1/2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div> {/* Product name */}
          <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* Price */}
          
          {/* Availability skeleton */}
          <div className="flex items-center gap-2 mt-4">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          {/* Tabs skeleton */}
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="h-10 w-32 bg-gray-300 rounded"></div> {/* Add to Cart */}
            <div className="h-10 w-32 bg-gray-300 rounded"></div> {/* Share buttons */}
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-8">
        <div className="w-full bg-gray-300 py-2 px-4 rounded-md mb-4">
          <div className="h-6 w-1/4 bg-gray-400 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-48 bg-gray-200 rounded-lg shadow-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
