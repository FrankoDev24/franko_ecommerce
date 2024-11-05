import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByShowroom } from "../../Redux/slice/productSlice";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Empty, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ShowroomProductsPage = () => {
  const { showRoomID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsByShowroom, loading, error, showroom } = useSelector(
    (state) => state.products
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // keep this in case we want to change items per load
  const observer = useRef();

  useEffect(() => {
    if (showRoomID) {
      dispatch(fetchProductsByShowroom(showRoomID));
    }
  }, [dispatch, showRoomID]);

  const products = (productsByShowroom[showRoomID] || [])
    .slice()
    .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));

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
        message.error(
          `Failed to add ${product.productName} to cart: ${error.message}`
        );
      });
  };

  const formatPrice = (price) =>
    price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const currentProducts = products.slice(0, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        {showroom ? `${showroom.showRoomName} Products` : "Showroom Products"}
      </h1>

      {error ? (
        <div className="text-center text-red-500 mt-6">Error fetching products</div>
      ) : currentProducts.length > 0 || loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {currentProducts.map((product, index) => (
            <div
              ref={index === currentProducts.length - 1 ? lastProductRef : null}
              key={product.productID || index} // fallback key for skeleton
              className="relative group p-4 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/product/${product.productID}`)}
            >
              {loading ? (
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-48 md:h-60 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ) : (
                <>
                  <div className="h-48 md:h-60 lg:h-72 flex items-center justify-center mb-4">
                    <img
                      src={`https://api.salesmate.app/Media/Products_Images/${product.productImage
                        .split("\\")
                        .pop()}`}
                      alt={product.productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                      {product.productName}
                    </h2>
                    <div className="flex md:items-center md:flex-row flex-col md:space-x-2">
                      <span className="text-lg md:text-xl font-bold text-gray-900">
                        {`₵${formatPrice(product.price)}`}
                      </span>
                      {product.oldPrice > 0 && (
                        <span className="text-sm line-through text-gray-500 md:inline-block block mt-1 md:mt-0">
                          {`₵${formatPrice(product.oldPrice)}`}
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
                    <ShoppingCartOutlined className="text-xl md:text-2xl text-red-500 hover:text-red-600 transition-colors duration-200" />
                  </div>
                </>
              )}
            </div>
          ))}
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

export default ShowroomProductsPage;
