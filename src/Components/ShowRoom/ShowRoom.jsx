import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Alert, Card, Button } from 'antd';
import { ShoppingCartOutlined, LeftOutlined, RightOutlined, FireOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ShowRoom.css';

const ShowroomPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showrooms, loading, error } = useSelector((state) => state.showrooms);
  const { productsByShowroom = {}, loading: loadingProducts, error: errorProducts } = useSelector((state) => state.products);

  // Initialize countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 30 });

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timerInterval); // Stop countdown when it reaches 0
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const sortedProducts = showrooms.map((showroom) => {
    const showroomProducts = productsByShowroom[showroom.showRoomID] || [];
    return {
      ...showroom,
      products: [...showroomProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
    };
  });

  useEffect(() => {
    dispatch(fetchShowrooms()).unwrap().catch((error) => console.error('Error fetching showrooms:', error));
  }, [dispatch]);

  useEffect(() => {
    if (showrooms.length > 0) {
      showrooms.forEach((showroom) => dispatch(fetchProductsByShowroom(showroom.showRoomID)).unwrap());
    }
  }, [dispatch, showrooms]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log(`Product ${product.productName} added to cart`);
  };

  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://api.salesmate.app';
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
    return <img src={imageUrl} alt="Product" className="w-full h-24 sm:h-32 object-cover rounded-lg" />;
  };

  const formatCurrency = (amount) => amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const scrollRef = useRef({});

  const scrollLeft = (id) => {
    scrollRef.current[id].scrollLeft -= 200;
  };

  const scrollRight = (id) => {
    scrollRef.current[id].scrollLeft += 200;
  };

  if (loading || loadingProducts) {
    return (
      <div className="container mx-auto p-4 mt-12">
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-1/2 sm:w-1/3 md:w-1/4 animate-pulse">
              <div className="bg-gray-200 h-24 sm:h-32 rounded-lg mb-4 flex items-center justify-center text-lg font-semibold text-gray-400">
                Loading
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || errorProducts) {
    return <Alert message="Error fetching data" description={error || errorProducts} type="error" />;
  }

  return (
    <div className="container mx-auto p-4">
      {sortedProducts
        .sort((a, b) => (a.showRoomName === 'Flash sales' ? -1 : b.showRoomName === 'Flash sales' ? 1 : 0))
        .filter((showroom) => showroom.products.length > 0)
        .map((showroom) => (
          <div key={showroom.showRoomID} className="mb-6">
            <div className="flex justify-between items-center mb-4 bg-red-500 text-white p-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <FireOutlined />
                <h2 className="text-sm sm:text-base">{showroom.showRoomName}</h2>
              </div>
              {showroom.showRoomName === 'Flash sales' && (
                <div className="text-center font-semibold text-xs sm:text-sm">
                  Ends in: {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                </div>
              )}
              <Link to={`/showroom/${showroom.showRoomID}`} className="flex items-center text-xs sm:text-sm">
                <span className="mr-1">View More</span>
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
                    className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/6 lg:w-1/6 p-2 relative group"
                  >
                    <Card
                      hoverable
                      className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
                      cover={
                        <div onClick={() => navigate(`/product/${product.productID}`)} className="cursor-pointer">
                          <div className="w-full h-24 sm:h-32 overflow-hidden rounded-lg">
                            {renderImage(product.productImage)}
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
