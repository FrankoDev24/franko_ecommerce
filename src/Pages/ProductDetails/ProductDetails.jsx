import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchProducts } from "../../Redux/slice/productSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tabs, Modal, Card, message} from "antd";
import { ShoppingCartOutlined, CheckCircleFilled } from "@ant-design/icons";
import { addToCart } from "../../Redux/slice/cartSlice";
import { FacebookOutlined, WhatsAppOutlined, ShareAltOutlined } from "@ant-design/icons";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentProduct = useSelector((state) => state.products.currentProduct);
  const { products, loading, error } = useSelector((state) => state.products);
  const cartId = useSelector((state) => state.cart.cartId);

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts()); // Fetch products
    dispatch(fetchProductById(productId)); // Fetch current product by ID
    window.scrollTo(0, 0); // Scroll to top on page load
  }, [dispatch, productId]);

  const recentProducts = products.slice(-12); // Get the last 12 products as related products

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    const cartData = {
      cartId,
      productId: currentProduct[0].productID,
      price: currentProduct[0].price,
      quantity: 1,
    };

    dispatch(addToCart(cartData))
      .then(() => {
        message.success('Product added to cart successfully!');
      })
      .catch((error) => {
        message.error(`Failed to add product to cart: ${error.message}`);
      })
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  const productUrl = window.location.href; // Get the current product URL

  // Share logic for Facebook
  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      '_blank'
    );
  };

  // Share logic for WhatsApp
  const handleWhatsAppShare = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(productUrl)}`,
      '_blank'
    );
  };

  const handleStickyButton = () => {
    if (window.scrollY > 200) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyButton);
    return () => {
      window.removeEventListener("scroll", handleStickyButton);
    };
  }, []);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) return <div>Error: {error}</div>;

  if (!currentProduct || currentProduct.length === 0) return <div>No product found</div>;

  const product = currentProduct[0];
  const backendBaseURL = "https://smfteapi.salesmate.app";
  const imageUrl = `${backendBaseURL}/Media/Products_Images/${product.productImage.split("\\").pop()}`;

  const productDescription = product.description.split("\n").map((text, index) => (
    <p key={index} className="mb-4">{text}</p>
  ));

  const renderRelatedProducts = () => {
    if (!recentProducts || recentProducts.length === 0) return null;
    return (
      <div className="mt-8">
        <div className="w-full bg-red-400 py-2 px-4 rounded-md mb-4">
          <h2 className="text-md lg:text-xl font-semibold text-white">
            Related Products
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentProducts.map((product) => (
            <Card
              key={product.productID}
              hoverable
              className="rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-lg w-full group"
              cover={
                <div onClick={() => navigate(`/product/${product.productID}`)} className="cursor-pointer relative">
                  {product.oldPrice > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                    </div>
                  )}
                  <div className="h-32 md:h-32 lg:h-48 flex items-center justify-center mb-3">
                    <img
                      src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                        .split("\\")
                        .pop()}`}
                      alt={product.productName}
                      className="w-32 md:w-24 lg:w-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              }
            >
              <Card.Meta
                title={<p className="font-semibold text-xs sm:text-sm truncate">{product.productName}</p>}
                description={
                  <div className="mt-1">
                    <p className="text-red-500 font-bold text-xs sm:text-sm">{`₵${formatPrice(product.price)}`}.00</p>
                    {product.oldPrice > 0 && (
                      <p className="text-gray-500 text-xs line-through sm:inline-block md:flex">
                        {`₵${formatPrice(product.oldPrice)}`}.00
                      </p>
                    )}
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Image */}
        <div className="lg:w-1/2">
          <img
            src={imageUrl}
            alt={product.productName}
            className="rounded-lg shadow-lg cursor-pointer"
            onClick={() => setImageModalVisible(true)}
            style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "5px" }}
          />
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-lg md:text-2xl font-bold mb-4">{product.productName}</h1>
          <div className="bg-red-100 p-2 rounded-lg inline-block mb-2">
            <span className="text-2xl font-bold">₵{formatPrice(product.price)}.00</span>
            {product.oldPrice > 0 && (
              <span className="line-through text-gray-500 ml-8">
                ₵{formatPrice(product.oldPrice)}.00
              </span>
            )}
          </div>

          <div className="space-y-4 mb-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircleFilled className="text-green-500" />
              <span className="font-medium">Availability:</span>
              <span className="text-green-500">In Stock</span>
            </div>
          </div>

          <Tabs
            items={[
              {
                key: "1",
                label: <span style={{ color: "red" }}>Product Description</span>,
                children: (
                  <div className="p-4" style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {productDescription}
                  </div>
                ),
              },
            ]}
          />

          {/* Add to Cart Button and Share */}
          <div className="hidden lg:flex flex-row lg:flex-row lg:items-center gap-8 mb-4 mt-4">
            <Button
              icon={<ShoppingCartOutlined />}
              size="large"
              className="lg:block bg-red-400 hover:bg-green-600 text-white px-6 py-2 flex-shrink-0"
              onClick={handleAddToCart}
              loading={isAddingToCart}
            >
              Add to Cart
            </Button>

            {/* Share this product */}
            <Button
              icon={<ShareAltOutlined  style={{marginRight: "10px"}}/>}
              className=" flex items-center lg:block   bg-green-800 text-white px-10 py-1 flex-shrink-0 "
              onClick={() => setShareModalVisible(true)}
            >
              Share this Product
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {renderRelatedProducts()}

      {/* Image Modal */}
      <Modal
        visible={isImageModalVisible}
        footer={null}
        onCancel={() => setImageModalVisible(false)}
        width={800}
      >
        <img src={imageUrl} alt={product.productName} className="w-full h-auto object-contain" />
      </Modal>

      {/* Share Modal */}
      <Modal
        title="Share this product"
        visible={isShareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        <div className=" md:ml-4 flex flex-col justify-center mt-4 gap-4">
          <Button
            icon={<FacebookOutlined />}
            size="large"
            onClick={handleFacebookShare}
       className="flex items-center bg-blue-600 text-white"   >
            Share on Facebook
          </Button>
          <Button
            icon={<WhatsAppOutlined />}
            size="large"
            onClick={handleWhatsAppShare}
       className="flex items-center bg-green-800 text-white"   >
            Share on WhatsApp
          </Button>
        </div>
      </Modal>
       {/* Sticky Add to Cart Button on Mobile */}
       <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-lg z-5 md:hidden">
      <div className="flex justify-between items-center gap-2">
        {/* Add to Cart Button */}
        <Button
          icon={<ShoppingCartOutlined />}
          size="large"
          className="bg-red-400 hover:bg-green-600 text-white w-48 flex-shrink-0"
          onClick={handleAddToCart}
          loading={isAddingToCart}
        >
          Add to Cart
        </Button>

        {/* Share This Product Section */}
        
        <div className="flex gap-1 ">
        <Button
              icon={<ShareAltOutlined />}
              className=" flex items-center lg:block   bg-green-800 text-white px-2 py-1 flex-shrink-0  "
              onClick={() => setShareModalVisible(true)}
            >
              Share this Product
            </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductDetail;
