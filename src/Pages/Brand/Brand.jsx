import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByBrand } from "../../Redux/slice/productSlice";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Empty, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const Brand = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const [visibleProducts, setVisibleProducts] = useState(8); // Number of products initially visible
  const observer = useRef();

  useEffect(() => {
    dispatch(fetchProductsByBrand(brandId)); // Fetch products for the selected brand
  }, [dispatch, brandId]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleProducts < products.length) {
          setVisibleProducts((prev) => prev + 8); // Load more products when the last product comes into view
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
    const backendBaseURL = 'https://api.salesmate.app';
    return `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-12"></div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse border rounded-lg shadow p-4">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Error fetching products</div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, visibleProducts).map((product, index) => (
              <div
                key={product.productID}
                ref={index === visibleProducts - 1 ? lastProductRef : null}
                className="relative group p-4 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleCardClick(product)}
              >
             <div className="h-48 md:h-64  flex items-center justify-center mb-4 ">
  <img
    src={renderImage(product.productImage)}
    alt={product.productName}
    className="w-full h-full object-cover rounded-lg"
  />
</div>

                <div className="flex flex-col space-y-1">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-500">
                      {`₵${product.price.toFixed(2)}`}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="text-sm line-through text-gray-500">
                        {`₵${product.oldPrice.toFixed(2)}`}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCartOutlined className="text-2xl text-red-500 hover:text-red-600 transition-colors duration-200" />
                </div>
              </div>
            ))}
          </div>
        </>
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
