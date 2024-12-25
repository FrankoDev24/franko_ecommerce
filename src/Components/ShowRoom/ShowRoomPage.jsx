import { useEffect, useState, useRef, useCallback } from "react";
import { useParams,} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByShowroom } from "../../Redux/slice/productSlice";
import { fetchShowrooms } from "../../Redux/slice/showRoomSlice";
import { Empty,  Input, Button } from "antd";
import { ShoppingCartOutlined, FilterOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import ProductDetailModal from "../../Pages/ProductDetails/ProductDetailsModal";

const ShowroomProductsPage = () => {
  const { showRoomID } = useParams();
  const dispatch = useDispatch();

  const { productsByShowroom, loading, error, showroom } = useSelector(
    (state) => state.products
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const observer = useRef();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  // Scroll to top when the page is loaded
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  useEffect(() => {
    if (showRoomID) {
      dispatch(fetchProductsByShowroom(showRoomID));
      dispatch(fetchShowrooms());
    }
  }, [dispatch, showRoomID]);

  const filteredProducts = (productsByShowroom[showRoomID] || [])
    .filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    )
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
  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setIsModalVisible(false);
  };


  const formatPrice = (price) =>
    price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const calculateDiscount = (oldPrice, price) => {
    if (oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return 0;
  };

  const currentProducts = filteredProducts.slice(0, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4 md:p-6">
            <Helmet>
        <title>{showroom ? `${showroom.showRoomName} Products` : "Showroom Products"}</title>
        <meta name="description" content="Browse and shop products from our showroom, including various categories and deals." />
        <meta name="keywords" content="Franko Trading, Electronics, Mobile Phones, Laptops, Accessories" />
        <meta property="og:title" content={showroom ? `${showroom.showRoomName} Products` : "Showroom Products"} />
        <meta property="og:description" content="Browse and shop products from our showroom, including various categories and deals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="URL_to_image" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={showroom ? `${showroom.showRoomName} Products` : "Showroom Products"} />
        <meta name="twitter:description" content="Browse and shop products from our showroom, including various categories and deals." />
        <meta name="twitter:image" content="URL_to_image" />
      </Helmet>

      <h3 className="text-md md:text-lg font-semibold mb-4 text-red-500">
        {showroom ? `${showroom.showRoomName} Products` : "Showroom Products"}
      </h3>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-green-600">Filter by Price</h3>
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
 {loading || error ? (
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
       {Array.from({ length: 12 }).map((_, index) => (
         <div
           key={index}
           className="animate-pulse border rounded-lg shadow p-3 relative bg-gray-100"
         >
           <div className="h-36 md:h-44 lg:h-52 flex items-center justify-center mb-3 bg-gray-200 rounded-lg relative">
             <div
               className="absolute inset-0 bg-center bg-no-repeat opacity-10"
               style={{
                 backgroundImage: "url('/frankoIcon.png')", // Adjust path as needed
                 backgroundSize: "90px",
                 backgroundPosition: "center center",
               }}
             ></div>
           </div>
           <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
           <div className="h-3 bg-gray-200 rounded w-1/2"></div>
         </div>
       ))}
     </div>
     
      )  : currentProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => {
            const discount = calculateDiscount(product.oldPrice, product.price);
            return (
              <div
                ref={index === currentProducts.length - 1 ? lastProductRef : null}
                key={product.productID || index}
                className="relative group p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(product.productID)}
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
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          isModalVisible={isModalVisible}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ShowroomProductsPage;
