import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined, LeftOutlined, RightOutlined, FireOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ShowRoom.css';

const ShowroomPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showrooms, loading: loadingShowrooms } = useSelector((state) => state.showrooms);
  const { productsByShowroom = {}, loading: loadingProducts } = useSelector((state) => state.products);

  // Countdown Timer State



  useEffect(() => {
    if (!showrooms.length) {
      dispatch(fetchShowrooms());
    } else {
      showrooms.forEach((showroom) => {
        if (!productsByShowroom[showroom.showRoomID]) {
          dispatch(fetchProductsByShowroom(showroom.showRoomID));
        }
      });
    }
  }, [dispatch, showrooms, productsByShowroom]);


  const sortedProducts = useMemo(() => {
    return showrooms.map((showroom) => {
      const showroomProducts = productsByShowroom[showroom.showRoomID] || [];
      return {
        ...showroom,
        products: [...showroomProducts]
          .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
          .slice(0, 10),
      };
    });
  }, [showrooms, productsByShowroom]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log(`Product ${product.productName} added to cart`);
  };

  const formatCurrency = (amount) => amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const scrollRef = useRef({});

  const scrollLeft = (id) => {
    scrollRef.current[id].scrollLeft -= 200;
  };

  const scrollRight = (id) => {
    scrollRef.current[id].scrollLeft += 200;
  };

  // Loading Skeleton
  if (loadingShowrooms || loadingProducts) {
    return (
      <div className="container mx-auto p-4 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse border rounded-lg shadow p-3 relative bg-gray-100">
              <div className="h-32 md:h-32 lg:h-32 flex items-center justify-center mb-3 bg-gray-200 rounded-lg">
              <div
             className="absolute inset-0 bg-center bg-no-repeat opacity-10"
             style={{
              backgroundImage: "url('./frankoIcon.png')", // Update with your actual logo path
              backgroundSize: "90px", // Adjust size of the logo
              backgroundPosition: "center center", // Center the logo
            }}
           ></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {sortedProducts
        .sort((a, b) => (a.showRoomName === 'Best selling' ? -1 : b.showRoomName === 'Best selling' ? 1 : 0))
        .filter((showroom) => showroom.products.length > 0)
        .map((showroom) => (
          <div key={showroom.showRoomID} className="mb-6">
            <div className="flex justify-between items-center mb-4 bg-green-700 text-white p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <FireOutlined />
                <h2 className="text-sm sm:text-base">{showroom.showRoomName}</h2>
              </div>
              
              <Link to={`/showroom/${showroom.showRoomID}`} className="flex items-center text-xs sm:text-sm">
                <span className="mr-1">Shop Now</span>
                <RightOutlined />
              </Link>
            </div>
            <div className="relative">
              <Button
                icon={<LeftOutlined />}
                shape="circle"
                className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-gray-300 z-10 shadow"
                onClick={() => scrollLeft(showroom.showRoomID)}
              />
              <div
                ref={(el) => (scrollRef.current[showroom.showRoomID] = el)}
                className="flex overflow-x-scroll space-x-4 no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                {showroom.products.map((product) => (
                  <div
                    key={product.productID}
                    className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 relative group"
                  >
                    <Card
                      hoverable
                      className="rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-lg w-42"
                      cover={
                        <div onClick={() => navigate(`/product/${product.productID}`)} className="cursor-pointer">
                          <div className="h-32 md:h-32 lg:h-32 flex items-center justify-center mb-3">
                            <img
                              src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                                .split("\\")
                                .pop()}`}
                              alt={product.productName}
                              className="w-48 md:w-32 lg:w-32 object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      }
                    >
                      <Card.Meta
                        title={<p className="font-semibold text-xs sm:text-sm truncate">{product.productName}</p>}
                        description={
                          <div className="mt-1">
                            <p className="text-red-500 font-bold text-xs sm:text-sm">{`₵${formatCurrency(product.price)}`}</p>
                          </div>
                        }
                      />
                      <Button
                        shape="circle"
                        icon={<ShoppingCartOutlined />}
                        className="absolute bottom-2 right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      />
                    </Card>
                  </div>
                ))}
              </div>
              <Button
                icon={<RightOutlined />}
                shape="circle"
                className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-300 z-10 shadow"
                onClick={() => scrollRight(showroom.showRoomID)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShowroomPage;
