import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Alert, Card, Row, Col } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ShowroomPage = () => {
  const dispatch = useDispatch();
  const { showrooms, loading, error } = useSelector((state) => state.showrooms);
  const { productsByShowroom = {}, loading: loadingProducts, error: errorProducts } = useSelector((state) => state.products);

  // Fetch showrooms on component mount
  useEffect(() => {
    const fetchShowroomsData = async () => {
      try {
        await dispatch(fetchShowrooms()).unwrap();
        console.log("Showrooms fetched successfully");
      } catch (error) {
        console.error("Error fetching showrooms:", error);
      }
    };
    fetchShowroomsData();
  }, [dispatch]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await Promise.all(
          showrooms.map(showroom =>
            dispatch(fetchProductsByShowroom(showroom.showRoomID)).unwrap()
          )
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    if (showrooms.length > 0) {
      fetchProducts();
    }
  }, [dispatch, showrooms]);

  // Handle adding products to the cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log(`Product ${product.productName} added to cart`);
  };

  // Loading state with Flowbite skeleton
  if (loading || loadingProducts) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Showrooms</h1>
        <Row gutter={16}>
          {Array.from({ length: 6 }).map((_, index) => (
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

  // Error handling
  if (error || errorProducts) {
    return <Alert message="Error fetching data" description={error || errorProducts} type="error" />;
  }

  // Render product images
  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://api.salesmate.app'; 
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
    
    return (
      <img
        src={imageUrl}
        alt="Product"
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Showrooms</h1>
      {showrooms.map((showroom) => {
        // Defensive check for productsByShowroom
        const showroomProducts = productsByShowroom[showroom.showRoomID] || [];
        
        // Only render showroom if it has products
        if (showroomProducts.length === 0) return null;

        return (
          <div key={showroom.showRoomID} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{showroom.showRoomName}</h2>
            <Row gutter={16}>
              {showroomProducts.map((product) => (
                <Col 
                  key={product.productID} 
                  xs={12} 
                  sm={12} 
                  md={8} 
                  lg={6} 
                  style={{ marginBottom: '20px' }}
                >
                  <Link to={`/product/${product.productID}`} style={{ textDecoration: 'none' }}>
                    <Card
                      hoverable
                      className="border rounded-lg shadow-lg relative group h-full flex flex-col transition-transform transform hover:scale-105"
                    >
                      <div className="flex-grow">
                        <div className="overflow-hidden">
                          {renderImage(product.productImage)}
                        </div>
                        <Card.Meta 
                          title={product.productName} 
                          className="mt-2 text-gray-700 font-semibold text-lg" 
                        />
                        <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between">
                          <p className="text-lg font-bold">{`₵${product.price.toFixed(2)}`}</p>
                          {product.oldPrice > 0 && (
                            <p className="text-gray-500 line-through mt-1 md:ml-2">{`₵${product.oldPrice.toFixed(2)}`}</p>
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
                        <ShoppingCartOutlined className="text-2xl text-primary text-red-500 hover:text-red-600 transition-colors duration-200" />
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default ShowroomPage;
