import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByBrand } from "../../Redux/slice/productSlice";
import { addToCart } from "../../Redux/slice/cartSlice";
import { Alert, Card, Col, Row, Pagination, Empty, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const Brand = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(fetchProductsByBrand(brandId)).unwrap();
        console.log(`Products for brand ID ${brandId} fetched successfully`);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch, brandId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Showrooms</h1>
        <Row gutter={16}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} style={{ marginBottom: '20px' }}>
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

  if (error) {
    return <Alert message="Error fetching products" description={error} type="error" />;
  }

  const handleCardClick = (product) => {
    navigate(`/product/${product.productID}`);
  };

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

  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://api.salesmate.app';
    return `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className='mt-12'></div>
      {currentProducts.length > 0 ? (
        <>
          <Row gutter={16}>
            {currentProducts.map((product) => (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <Card
  hoverable
  cover={
    <img 
      alt={product.productName} 
      src={renderImage(product.productImage)} 
      className="h-full w-full object-cover" 
    />
  }
  className="border rounded shadow relative " // Use aspect-square to make card square-shaped
  onClick={() => handleCardClick(product)}
>
  <Card.Meta title={product.productName} />
  <div className="flex justify-between mt-2">
    <p className="text-lg font-bold">{`₵${product.price.toFixed(2)}`}</p>
    {product.oldPrice && (
      <p className="text-gray-500 line-through">{`₵${product.oldPrice.toFixed(2)}`}</p>
    )}
  </div>
  <div
    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    onClick={(e) => {
      e.stopPropagation();
      handleAddToCart(product);
    }}
  >
    <ShoppingCartOutlined className="text-2xl text-primary text-red-500 cursor-pointer" />
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
            description={
              <span>
                <strong>No Products Found</strong>
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 200, marginBottom: 6 }}
          />
        </div>
      )}
    </div>
  );
};

export default Brand;
