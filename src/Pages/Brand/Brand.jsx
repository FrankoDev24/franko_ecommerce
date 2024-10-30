import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByBrand } from "../../Redux/slice/productSlice";
import { addToCart } from "../../Redux/slice/cartSlice"; // Import addToCart action
import { Spin, Alert, Card, Col, Row, Pagination, Empty, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const Brand = () => {
  const { brandId } = useParams(); // Get brandId from URL parameters
  const dispatch = useDispatch();
  const navigate = useNavigate(); // To navigate to product details page
  const { products, loading, error } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of products per page

  useEffect(() => {
    // Fetch products by brand ID when component mounts or brandId changes
    dispatch(fetchProductsByBrand(brandId));
  }, [dispatch, brandId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the index of the last product on the current page
  const lastIndex = currentPage * itemsPerPage;
  // Calculate the index of the first product on the current page
  const firstIndex = lastIndex - itemsPerPage;
  // Slice the products array to get the products for the current page
  const currentProducts = products.slice(firstIndex, lastIndex);

  if (loading) {
    return <Spin tip="Loading products..." />;
  }

  if (error) {
    return <Alert message="Error fetching products" description={error} type="error" />;
  }

  const handleCardClick = (product) => {
    // Navigate to the product description page
    navigate(`/product/${product.productID}`);
  };

  const handleAddToCart = (product) => {
    // Dispatch the addToCart action
    const cartData = {
      productId: product.productID,
      productName: product.productName,
      quantity: 1, // Default quantity to add is 1
      price: product.price,
      image: product.productImage,
    };

    dispatch(addToCart(cartData))
      .unwrap() // Handle success or error with the action
      .then(() => {
        message.success(`${product.productName} added to cart!`);
      })
      .catch((error) => {
        message.error(`Failed to add ${product.productName} to cart: ${error.message}`);
      });
  };

  // Function to render the image with the backend URL
  const renderImage = (imagePath) => {
    const backendBaseURL = 'https://api.salesmate.app'; // Replace with your actual backend URL
    return `${backendBaseURL}/Media/Products_Images/${imagePath.split('\\').pop()}`; // Construct image URL
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
                  cover={<img alt={product.productName} src={renderImage(product.productImage)} />} // Use renderImage to display the product image
                  className="border rounded shadow relative group"
                  onClick={() => handleCardClick(product)} // Click to navigate
                >
                  <Card.Meta title={product.productName} />
                  <div className="flex justify-between mt-2">
                    <p className="text-lg font-bold">{`$${product.price.toFixed(2)}`}</p>
                    {product.oldPrice && (
                      <p className="text-gray-500 line-through">{`$${product.oldPrice.toFixed(2)}`}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{product.description}</p>
                  <div
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating to product detail page when clicked
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCartOutlined className="text-2xl text-primary text-red-500 cursor-pointer" />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Pagination Component */}
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={products.length}
            onChange={handlePageChange}
            className="mt-4"
            showSizeChanger={false} // Disable page size changer for simplicity
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
