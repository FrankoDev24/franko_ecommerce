import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByBrand } from "../../Redux/slice/productSlice";
import { fetchBrands } from "../../Redux/slice/brandSlice";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Empty, message, Input, Button } from 'antd';
import { ShoppingCartOutlined, FilterOutlined } from '@ant-design/icons';

const Brand = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
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

  const filteredProducts = (products || [])
    .filter(product => product.price >= minPrice && product.price <= maxPrice)
    .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

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

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const currentProducts = filteredProducts.slice(0, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h3 className="text-2xl md:text-2xl font-semibold mb-4 text-red-500">
        {selectedBrand ? `${selectedBrand.brandName} Products` : "Brand Products"}
      </h3>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Related Brands</h3>
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

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Filter by Price</h3>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="Min Price"
            style={{ width: 100 }}
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="Max Price"
            style={{ width: 100 }}
          />
          <Button
            className="bg-red-500 hover:bg-green-600 text-white rounded-full"
            icon={<FilterOutlined />}
          >
            Filter
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-500 mt-6">Error fetching products</div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse border rounded-lg shadow p-3 relative bg-gray-100">
              <div className="h-36 md:h-44 lg:h-52 flex items-center justify-center mb-3 bg-gray-200 rounded-lg">
                <span className="text-gray-500 text-2xl font-bold">Franko</span>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => {
            const discount = product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
            return (
              <div
                ref={index === currentProducts.length - 1 ? lastProductRef : null}
                key={product.productID || index}
                className="relative group p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/product/${product.productID}`)}
              >
                {discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {`${discount}% OFF`}
                  </div>
                )}
                <div className="h-32 md:h-32 lg:h-48 flex items-center justify-center mb-3">
                  <img
                    src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                      .split("\\")
                      .pop()}`}
                    alt={product.productName}
                    className="w-32 md:w-24 lg:w-48 object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <h2 className="text-sm md:text-md font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm md:text-md text-red-500">
                      {`₵${formatPrice(product.price)}`}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="text-sm line-through text-gray-500">
                        {`₵${formatPrice(product.oldPrice)}`}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                  className="absolute bottom-2 right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty
            description={<span><strong>No Products Found</strong></span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 200, marginBottom: 6 }}
          />
        </div>
      )}
    </div>
  );
};

export default Brand;
