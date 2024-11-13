import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByShowroom } from "../../Redux/slice/productSlice";
import { fetchShowrooms } from "../../Redux/slice/showRoomSlice";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Empty, message, Slider, Tag, Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ShowroomProductsPage = () => {
  const { showRoomID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsByShowroom, loading, error, showroom } = useSelector(
    (state) => state.products
  );
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Keep this in case we want to change items per load
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const observer = useRef();

  useEffect(() => {
    if (showRoomID) {
      dispatch(fetchProductsByShowroom(showRoomID));
      dispatch(fetchShowrooms()); // Fetch showrooms to display the other showroom options
    }
  }, [dispatch, showRoomID]);

  // Ensure that productsByShowroom[showRoomID] exists before filtering
  const products = (productsByShowroom[showRoomID] || [])
    .filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    )
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
      <h3 className="text-2xl md:text-3xl font-semibold mb-4">
        {showroom ? `${showroom.showRoomName} Products` : "Shops"}
      </h3>

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

      {/* Loading or Error Handling */}
      {error ? (
        <div className="text-center text-red-500 mt-6">Error fetching products</div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse border rounded-lg shadow p-3">
            <div className="h-36 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      ) : currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
          {currentProducts.map((product, index) => (
            <div
              ref={index === currentProducts.length - 1 ? lastProductRef : null}
              key={product.productID || index}
              className="relative group p-3 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/product/${product.productID}`)}
            >
              <div className="h-36 md:h-44 lg:h-52 flex items-center justify-center mb-3">
                <img
                  src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage.split("\\").pop()}`}
                  alt={product.productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <h2 className="text-sm md:text-base text-gray-800 truncate">
                  {product.productName}
                </h2>
                <div className="flex md:items-center md:flex-row flex-col md:space-x-2">
                  <span className="text-sm md:text-md text-red-500">
                    {`₵${formatPrice(product.price)}`}
                  </span>
                  {product.oldPrice > 0 && (
                    <span className="text-sm line-through text-gray-500 md:inline-block block mt-1 md:mt-0">
                      {`₵${formatPrice(product.oldPrice)}`}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Tag color="red">{product.brandName}</Tag>
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
