import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByShowroom } from '../../Redux/slice/productSlice';
import { addToCart } from '../../Redux/slice/cartSlice';
import { Alert, Card, Row, Col, Pagination, Empty, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const ShowroomProductsPage = () => {
  const { showRoomID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsByShowroom, loading, error, showroomName } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (showRoomID) {
      dispatch(fetchProductsByShowroom(showRoomID));
    }
  }, [dispatch, showRoomID]);

  const handlePageChange = (page) => setCurrentPage(page);

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
        message.error(`Failed to add ${product.productName} to cart: ${error.message}`);
      });
  };

  const products = productsByShowroom[showRoomID] || [];
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);

  if (loading) return <p>Loading products...</p>;
  if (error) return <Alert message="Error fetching products" description={error} type="error" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-5">{showroomName || 'Showroom Products'}</h1>
      {currentProducts.length > 0 ? (
        <>
          <Row gutter={[24, 32]}>
            {currentProducts.map((product) => (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="transition-transform transform hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden relative"
                  cover={
                    <img
                      alt={product.productName}
                      src={`https://api.salesmate.app/Media/Products_Images/${product.productImage.split('\\').pop()}`}
                      className="h-full w-full object-cover"
                    />
                  }
                  onClick={() => navigate(`/product/${product.productID}`)}
                >
                  <div className="p-4">
                    <Card.Meta
                      title={<p className="text-xl font-semibold text-gray-800">{product.productName}</p>}
                      description={
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-lg font-bold text-gray-900">{`₵${product.price.toFixed(2)}`}</p>
                          {product.oldPrice > 0 && (
                            <p className="text-sm line-through text-gray-500">{`₵${product.oldPrice.toFixed(2)}`}</p>
                          )}
                        </div>
                      }
                    />
                  </div>
                  <div
                    className="absolute bottom-4 right-4 bg-primary rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCartOutlined className="bg-red-500 text-white text-xl cursor-pointer" />
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
            className="mt-6"
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

export default ShowroomProductsPage;
