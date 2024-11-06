import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Alert, Card, Row, Col, Button } from 'antd';
import { ShoppingCartOutlined, ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ShowRoom.css';

const ShowroomPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showrooms, loading, error } = useSelector((state) => state.showrooms);
  const { productsByShowroom = {}, loading: loadingProducts, error: errorProducts } = useSelector((state) => state.products);
  
  // Use shallow copy to avoid mutation
  const sortedProducts = showrooms.map((showroom) => {
    const showroomProducts = productsByShowroom[showroom.showRoomID] || [];
    return {
      ...showroom,
      products: [...showroomProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
    };
  });

  useEffect(() => {
    dispatch(fetchShowrooms()).unwrap().catch(error => console.error('Error fetching showrooms:', error));
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
    return <img src={imageUrl} alt="Product" className="w-full h-64 object-cover rounded-lg" />;
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
  {sortedProducts
    .sort((a, b) => (a.showRoomName === 'Flash sales' ? -1 : b.showRoomName === 'Flash sales' ? 1 : 0)) // Ensure 'Flash Sales' is first
    .filter((showroom) => showroom.products.length > 0)
    .map((showroom) => (
      <div key={showroom.showRoomID} className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button className="text-md font-semibold text-white bg-red-500 py-2 px-4 rounded-full">
            {showroom.showRoomName}
          </button>

          <Link to={`/showroom/${showroom.showRoomID}`} className="text-red-500 flex items-center">
            <span>View More</span>
            <ArrowRightOutlined />
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
            className="flex overflow-x-scroll space-x-4 no-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            {showroom.products.map((product) => (
              <div key={product.productID} className="flex-shrink-0 w-1/4 p-2 relative group">
                <Card
                  hoverable
                  className="border rounded-lg shadow-lg flex flex-col h-full transition-transform transform hover:scale-105 relative p-4"
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
                          <div className="text-xs text-gray-500 line-through flex flex-col md:flex-row">
                            <p>{`₵${formatCurrency(product.oldPrice)}`}</p>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <Button
                    shape="circle"
                    icon={<ShoppingCartOutlined />}
                    className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-red-500 text-white group-hover:opacity-100"
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
            className="absolute top-1/2 transform -translate-y-1/2 right-0 bg-gray-200 z-10"
            onClick={() => scrollRight(showroom.showRoomID)}
          />
        </div>
      </div>
    ))}
</div>

 
  );
};

export default ShowroomPage;
