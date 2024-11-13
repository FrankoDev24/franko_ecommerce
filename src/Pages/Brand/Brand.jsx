import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByBrand } from "../../Redux/slice/productSlice";
import { fetchBrands } from "../../Redux/slice/brandSlice";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Empty, message, Slider, Input, Tag, Divider } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const Brand = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const observer = useRef();

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProductsByBrand(brandId));
  }, [dispatch, brandId]);

  const selectedBrand = brands.find(brand => brand.brandId === brandId);
  const filteredBrands = selectedBrand
    ? brands.filter(brand => brand.categoryId === selectedBrand.categoryId)
    : [];

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleProducts < products.length) {
          setVisibleProducts((prev) => prev + 8);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, products.length, visibleProducts]
  );

  const handleCardClick = (product) => {
    navigate(`/product/${product.productID}`);
  };

  const handleAddToCart = (product) => {
    const cartData = {
      productId: product.productID,
      productName: product.productName,
      quantity: 1,
      price: product.price,
      image: product.productImage,
    };

    dispatch(addToCart(cartData))
      .unwrap()
      .then(() => {
        message.success(`${product.productName} added to cart!`);
      })
      .catch((error) => {
        message.error(`Failed to add ${product.productName} to cart: ${error.message}`);
      });
  };

  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://smfteapi.salesmate.app';
    return `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const filteredProducts = products.filter(
    product => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4">
        {/* Brands display */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 ">Related Brands</h2>
          <div className="flex flex-wrap gap-4">
            {filteredBrands.map(brand => (
              <div
                key={brand.brandId}
                className={`${
                  brand.brandId === brandId ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                } px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-red-500 text-gray-700 hover:text-white`}
                onClick={() => navigate(`/brand/${brand.brandId}`)}
              >
                {brand.brandName}
              </div>
            ))}
          </div>
        </div>
<Divider />
        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Filter by Price</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              placeholder="Min"
              style={{ width: 100 }}
            />
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              placeholder="Max"
              style={{ width: 100 }}
            />
          </div>
          <Slider
  range
  min={0}
  max={200000}
  onChange={setPriceRange}
  value={priceRange}
  tipFormatter={(value) => `₵${formatPrice(value)}`}
  trackStyle={{ backgroundColor: 'red' }}
  handleStyle={{ borderColor: 'red' }}
/>

        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse border rounded-lg shadow p-3">
              <div className="h-36 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Error fetching products</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.slice(0, visibleProducts).map((product, index) => (
            <div
              key={product.productID}
              ref={index === visibleProducts - 1 ? lastProductRef : null}
              className="relative group p-3 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(product)}
            >
              <div className="h-36 md:h-48 flex items-center justify-center mb-3">
                <img
                  src={renderImage(product.productImage)}
                  alt={product.productName}
                  className="w-50 h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col space-y-1">
              
                <h2 className="text-sm md:text-base  text-gray-800 truncate">
                  {product.productName}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm md:text-md font-medium text-red-500">
                    {`₵${formatPrice(product.price.toFixed(2))}`}
                  </span>
                  {product.oldPrice > 0 && (
                    <span className="text-xs line-through text-gray-500">
                      {`₵${formatPrice(product.oldPrice.toFixed(2))}`}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Tag color="red">{product.showRoomName}</Tag>
                </div>
              </div>
             
              <div
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                <ShoppingCartOutlined className="text-xl md:text-2xl text-red-500 hover:text-red-600 transition-colors duration-200" />
              </div>
          
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty
            description={
              <span>
                <strong>No Products Found</strong>
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 200, marginBottom: 6 }}
          />
        </div>
      )}
    </div>
  );
};

export default Brand;
