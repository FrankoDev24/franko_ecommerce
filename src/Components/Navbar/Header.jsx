import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Carousel } from 'antd';
import { MenuOutlined, AppstoreOutlined, CaretDownOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../Redux/slice/categorySlice';
import { fetchBrands } from '../../Redux/slice/brandSlice';
import caro1 from '../../assets/slide1.jpg';
import caro2 from '../../assets/slide2.jpg';
import caro3 from '../../assets/slide3.jpg';
import caro4 from '../../assets/slide4.jpg';
import caro5 from '../../assets/slide5.jpg';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [carouselHeight, setCarouselHeight] = useState('auto');
  
  const categoriesRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, status } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    if (categoriesRef.current) {
      setCarouselHeight(categoriesRef.current.clientHeight);
    }
  }, [categories, brands]);

  const renderBrands = (categoryId) => {
    const filteredBrands = brands.filter((brand) => brand.categoryId === categoryId);
    if (filteredBrands.length === 0) return null;

    return (
      <div className="brands-list p-4 bg-white shadow-lg rounded-lg absolute top-0 left-full ml-2 w-72 grid grid-cols-3 gap-4 overflow-y-auto max-h-48 z-10">
        <CloseOutlined
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer md:block hidden"
          onClick={() => setActiveCategoryId(null)}
        />
        {filteredBrands.map((brand) => (
          <div
            key={brand.brandId}
            className="brand-item py-2 px-3 cursor-pointer text-center hover:bg-gray-100 rounded-md"
            onClick={() => navigate(`/brand/${brand.brandId}`)}
          >
            {brand.brandName}
          </div>
        ))}
      </div>
    );
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategoryId(categoryId === activeCategoryId ? null : categoryId);
  };

  return (
    <div className="container mx-auto p-4 mb-12">
      <div className="header-container flex flex-col md:flex-row relative bg-gray-50">
        
        {/* Categories Block on the Left (Desktop View) */}
        <div
          className="categories-block hidden md:flex flex-col w-1/4 p-6 rounded-lg shadow-lg relative"
          ref={categoriesRef}
        >
          <h3 className="text-lg font-semibold mb-4 text-red-500">Categories</h3>
          {status === 'loading' ? (
            <p>Loading categories...</p>
          ) : (
            <div className="categories-list">
              {categories.map((category) => (
                <div
                  key={category.categoryId}
                  className={`category-item flex items-center justify-between cursor-pointer py-2 relative rounded-md ${activeCategoryId === category.categoryId ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'} hover:bg-green-50`}
                  onClick={() => handleCategoryClick(category.categoryId)}
                >
                  <span className="flex items-center">
                    <AppstoreOutlined />
                    <span className="ml-2 font-semibold">{category.categoryName}</span>
                  </span>
                  <CaretDownOutlined className="text-gray-400" />
                  {activeCategoryId === category.categoryId && renderBrands(category.categoryId)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Carousel Block on the Right for Desktop View */}
        <div className="carousel-container hidden md:block w-3/4 mb-10"  style={{ height: '300px' }}>
  <Carousel autoplay>
    {[caro1, caro2, caro3, caro4, caro5].map((image, index) => (
      <div key={index}>
        <img 
          src={image} 
          alt={`Carousel ${index + 1}`} 
          className="carousel-image w-full object-cover rounded-lg shadow-lg" 
          style={{ height: '530px' }} 
        />
      </div>
    ))}
  </Carousel>
</div>

        {/* Mobile View: Carousel and Menu Button */}
        <div className="mobile-header md:hidden w-full relative mb-8">
          <div className="mobile-menu-button sticky top-0 left-0 w-full z-50 bg-red-500 p-4 mb-5">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setIsMenuOpen(true)}
              className="menu-button text-sm text-white flex items-center justify-center focus:bg-red-500"
            >
              <span className="ml-2">Categories</span>
            </Button>
          </div>

          <div className="carousel w-full h-24 mt-0.5 mb-4">
  <Carousel autoplay>
    {[caro1, caro2, caro3, caro4, caro5].map((image, index) => (
      <div key={index}>
        <img 
          src={image} 
          alt={`Carousel ${index + 1}`} 
          className="carousel-image w-full h-full object-cover rounded-lg shadow-lg" 
        />
      </div>
    ))}
  </Carousel>
</div>

        </div>

        {/* Drawer for Mobile View */}
        <Drawer
          title="Categories"
          placement="left"
          width={300}
          onClose={() => setIsMenuOpen(false)}
          visible={isMenuOpen}
          headerStyle={{ backgroundColor: '#00796b', color: 'white' }}
          drawerStyle={{ backgroundColor: '#f4f6f8' }}
        >
          {categories.map((category) => (
            <div key={category.categoryId} className="category-drawer-item">
              <div
                className={`category-title flex items-center justify-between cursor-pointer py-2 rounded-md ${expandedCategoryId === category.categoryId ? 'bg-green-200' : ''}`}
                onClick={() => setExpandedCategoryId(expandedCategoryId === category.categoryId ? null : category.categoryId)}
              >
                <span className="text-gray-700">
                  <AppstoreOutlined /> <span className="ml-2">{category.categoryName}</span>
                </span>
                {expandedCategoryId === category.categoryId ? (
                  <CloseOutlined onClick={() => setExpandedCategoryId(null)} />
                ) : (
                  <CaretDownOutlined />
                )}
              </div>
              {expandedCategoryId === category.categoryId && (
                <div className="ml-4 grid grid-cols-3 gap-3 overflow-y-auto max-h-40">
                  {brands
                    .filter((brand) => brand.categoryId === category.categoryId)
                    .map((brand) => (
                      <div
                        key={brand.brandId}
                        className="brand-item py-2 cursor-pointer text-center hover:bg-gray-100 rounded-md bg-white"
                        onClick={() => navigate(`/brand/${brand.brandId}`)}
                      >
                        {brand.brandName}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
