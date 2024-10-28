import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Spin, Alert, Card, Col, Row, Pagination, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const ShowRoomPage = () => {
  const { showRoomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products = [], loading: loadingProducts, error: errorProducts } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(fetchProductsByShowroom(showRoomId)).unwrap();
        console.log(`Products for showroom ID ${showRoomId} fetched successfully`);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch, showRoomId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCardClick = (product) => {
    // Navigate to product details page
    navigate(`/product/${product.productID}`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); // Dispatch action to add product to the cart
  };

  // Calculate pagination indices
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);

  if (loadingProducts) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Loading products..." />
      </div>
    );
  }

  if (errorProducts) {
    return <Alert message="Error fetching products" description={errorProducts} type="error" />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mt-12"></div>
      {currentProducts.length > 0 ? (
        <>
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
                <Card
                  hoverable
                  cover={<img alt={product.productName} src={product.productImage} loading="lazy" />}
                  className="border rounded shadow relative group h-full"
                  onClick={() => handleCardClick(product)} 
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
                      e.stopPropagation(); // Prevent card click
                      handleAddToCart(product); // Add product to cart
                    }}
                  >
                    <ShoppingCartOutlined className="text-2xl text-primary text-red-500" />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={products.length}
            onChange={handlePageChange}
            className="mt-4"
            showSizeChanger={false}
          />
        </>
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

export default ShowRoomPage;
