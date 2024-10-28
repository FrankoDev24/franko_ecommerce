import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Spin, Alert, Card, Row, Col } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Import Link

const Showroom = () => {
  const dispatch = useDispatch();
  const { showrooms, loading, error } = useSelector((state) => state.showrooms);
  const { products = [], loading: loadingProducts, error: errorProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchShowrooms()).unwrap();
        console.log("Showrooms fetched successfully");
      } catch (error) {
        console.error("Error fetching showrooms:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const flashSalesShowroom = showrooms.find(showroom => showroom.showRoomName === "Flash Sales");

  useEffect(() => {
    const fetchProducts = async () => {
      if (flashSalesShowroom) {
        try {
          await dispatch(fetchProductsByShowroom(flashSalesShowroom.showRoomID)).unwrap();
          console.log("Products fetched for Flash Sales showroom successfully");
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [dispatch, flashSalesShowroom]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log(`Product ${product.productName} added to cart`);
  };

  if (loading || loadingProducts) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Loading..." />
      </div>
    );
  }

  if (error || errorProducts) {
    return <Alert message="Error fetching data" description={error || errorProducts} type="error" />;
  }

  if (!flashSalesShowroom) {
    return <Alert message="No 'Flash Sales' showroom available" type="warning" />;
  }

  const currentProducts = Array.isArray(products) ? products : [];

  const renderImage = (imagePath) => {
    const backendBaseURL = 'http://197.251.217.45:5000'; 
    const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
    
    return (
      <img
        src={imageUrl}
        alt="Product"
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
      />
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{flashSalesShowroom.showRoomName} - Featured Products</h1>
      <Row gutter={16} style={{ marginBottom: '40px' }}>
        {currentProducts.map((product) => (
          <Col 
            key={product.productID} 
            xs={12} 
            sm={12} 
            md={8} 
            lg={6} 
            style={{ marginBottom: '20px' }}
          >
            <Link to={`/product/${product.productID}`} style={{ textDecoration: 'none' }}> {/* Added Link */}
              <Card
                hoverable
                cover={renderImage(product.productImage)}
                className="border rounded shadow relative group h-full"
              >
                <Card.Meta title={product.productName} />
                <div className="mt-2">
                  <p className="text-lg font-bold">{`₵${product.price.toFixed(2)}`}</p>
                  {product.oldPrice && (
                    <p className="text-gray-500 line-through block md:inline-block mt-1 md:ml-2">{`₵${product.oldPrice.toFixed(2)}`}</p>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1 truncate">{product.description}</p>
                <div
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCartOutlined className="text-2xl text-primary text-red-500" />
                </div>
              </Card>
            </Link> {/* Close Link */}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Showroom;
