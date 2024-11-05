import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Alert, Card, Row, Col, Button } from 'antd';
import { ShoppingCartOutlined, ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const ShowroomPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showrooms, loading, error } = useSelector((state) => state.showrooms);
  const { productsByShowroom = {}, loading: loadingProducts, error: errorProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchShowrooms()).unwrap().catch(error => console.error("Error fetching showrooms:", error));
  }, [dispatch]);

  useEffect(() => {
    if (showrooms.length > 0) {
      showrooms.forEach(showroom => dispatch(fetchProductsByShowroom(showroom.showRoomID)).unwrap());
    }
  }, [dispatch, showrooms]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log(`Product ${product.productName} added to cart`);
  };

  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://api.salesmate.app';
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
    
    return (
      <img
        src={imageUrl}
        alt="Product"
        className="w-full h-40 object-cover rounded-lg"
      />
    );
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Shop By Showrooms</h1>
        <Row gutter={16}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Col key={index} xs={12} sm={12} md={8} lg={6} style={{ marginBottom: '20px' }}>
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error || errorProducts) {
    return <Alert message="Error fetching data" description={error || errorProducts} type="error" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Shop By Showrooms</h1>
      <Row gutter={[16, 16]}>
        {showrooms
          .filter((showroom) => productsByShowroom[showroom.showRoomID]?.length > 0)
          .map((showroom) => {
            const showroomProducts = productsByShowroom[showroom.showRoomID] || [];
            const sortedProducts = [...showroomProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return (
              <Col key={showroom.showRoomID} xs={24} sm={24} md={12} lg={6} style={{ marginBottom: '20px' }}>
                <div className="p-4 border rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm md:text-lg font-semibold text-green-800">{showroom.showRoomName}</h2>
                    <Link to={`/showroom/${showroom.showRoomID}`}>
                      <Button 
                        shape="round" 
                        icon={<ArrowRightOutlined />} 
                        size="small"
                        className="text-xs bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 md:text-sm"
                      >
                        View More
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <Button 
                      icon={<LeftOutlined />} 
                      shape="circle" 
                      className="absolute top-1/2 transform -translate-y-1/2 left-0 bg-gray-200 z-10"
                      onClick={() => scrollLeft(showroom.showRoomID)}
                    />
                    <div
                      ref={(el) => (scrollRef.current[showroom.showRoomID] = el)}
                      className="flex overflow-x-scroll space-x-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {sortedProducts.slice(0, 10).map((product, index) => (
                        <div key={product.productID} className="flex-shrink-0 w-40">
                          <Card
                            hoverable
                            className="border rounded-lg flex flex-col"
                            style={{ height: '100%' }}
                            cover={
                              <div
                                onClick={() => navigate(`/product/${product.productID}`)}
                                className="cursor-pointer"
                              >
                                {renderImage(product.productImage)}
                              </div>
                            }
                          >
                            <Card.Meta 
                              title={<p className="text-gray-700 font-semibold text-xs truncate">{product.productName}</p>} 
                              description={
                                <div className="flex flex-col mt-1">
                                  <p className="text-xs font-bold text-red-500">{`₵${formatCurrency(product.price)}`}</p>
                                  {product.oldPrice > 0 && (
                                    <p className="text-xs text-gray-500 line-through">{`₵${formatCurrency(product.oldPrice)}`}</p>
                                  )}
                                </div>
                              } 
                            />
                            {index === sortedProducts.length - 1 && (
                              <div 
                                onClick={() => navigate(`/showroom/${showroom.showRoomID}`)}
                                className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer"
                              >
                                <ArrowRightOutlined className="text-xl text-red-500" />
                              </div>
                            )}
                            <div
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                            >
                              <ShoppingCartOutlined className="text-2xl text-primary text-red-500 hover:text-red-600 transition-colors duration-200" />
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                    <Button 
                      icon={<RightOutlined />} 
                      shape="circle" 
                      className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-200 z-10"
                      onClick={() => scrollRight(showroom.showRoomID)}
                    />
                  </div>
                </div>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default ShowroomPage;
