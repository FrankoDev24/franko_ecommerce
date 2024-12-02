import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../Redux/slice/categorySlice';
import ProductCarousel from '../../Components/Carousel/ProductCarousel';
import { Card, Spin } from 'antd';

function Categories() {
  const dispatch = useDispatch();
  
  // Select the categories, loading, and error from the Redux store
  const { categories, loading, error } = useSelector((state) => state.categories);

  // Fetch categories when the component is mounted
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <ProductCarousel />

      <div className="container mx-auto p-4">
        {/* Show loading spinner if data is being fetched */}
        {loading && <div className="flex justify-center items-center"><Spin size="large" /></div>}
        
        {/* Show error message if any */}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        
        {/* Display categories when data is available */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-4 flex flex-col items-center">
                  <div className="w-32 h-32 mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Categories;
