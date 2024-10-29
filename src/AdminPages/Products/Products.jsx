import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Redux/slice/productSlice";
import { fetchBrands } from "../../Redux/slice/brandSlice";
import { fetchShowrooms } from "../../Redux/slice/showRoomSlice";
import { Button, Table, message, Input, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons"; // Import the view icon
import AddProduct from "./AddProduct";
import UpdateProduct from "./EditProduct";

const Products = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const { showrooms } = useSelector((state) => state.showrooms);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // New modal state for product details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [fullImageUrl, setFullImageUrl] = useState("");

  const backendBaseURL = "https://api.salesmate.app"; // Replace with your actual backend URL

  const fetchProductData = useCallback(async () => {
    try {
      await dispatch(fetchProducts()).unwrap();
      await dispatch(fetchBrands()).unwrap();
      await dispatch(fetchShowrooms()).unwrap();
    } catch (err) {
      console.error(err);
      message.error("Failed to load data.");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleAddProduct = () => {
    setSelectedProduct(null); // Reset selected product for adding
    setIsAddModalVisible(true);
  };

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalVisible(true);
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailModalVisible(true); // Open the product details modal
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter products based on search input
  const filteredProducts = products.filter((product) => {
    const productNameMatch =
      product.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
      false;
    const showroomMatch =
      product.showRoomName?.toLowerCase().includes(searchText.toLowerCase()) ||
      false;
    const brandMatch =
      product.brandName?.toLowerCase().includes(searchText.toLowerCase()) ||
      false;
    return productNameMatch || showroomMatch || brandMatch;
  });

  // Sort products by date
  const sortedProducts = filteredProducts.sort(
    (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (imagePath) => {
        const imageUrl = `${backendBaseURL}/Media/Products_Images/${imagePath
          .split("\\")
          .pop()}`;

        return (
          <img
            src={imageUrl}
            alt="Product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              setFullImageUrl(imageUrl); // Set the image URL for modal
              setIsImageModalVisible(true); // Open image modal
            }}
          />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `₵${parseFloat(text).toFixed(2)}`, // Format price
    },
    {
      title: "Old Price",
      dataIndex: "oldPrice",
      key: "oldPrice",
      render: (text) => `₵${parseFloat(text).toFixed(2)}`, // Format price
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (text) => new Date(text).toLocaleDateString(), // Format date
      sorter: (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated), // Enable sorting
    },
    {
      title: "Brand",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Showroom",
      dataIndex: "showRoomName",
      key: "showRoomName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleUpdateProduct(record)}>Edit</Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewProductDetails(record)} // Open product details
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search by product, showroom, or brand name"
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        onClick={handleAddProduct}
        style={{ marginBottom: 16 }}
      >
        Add Product
      </Button>

      <Table dataSource={sortedProducts} columns={columns} rowKey="productID" />

      {/* Add Product Modal */}
      <AddProduct
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          fetchProductData(); // Refresh the product list after adding
        }}
        brands={brands}
        showrooms={showrooms}
      />
      
      {/* Update Product Modal */}
      <UpdateProduct
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        product={selectedProduct}
        brands={brands}
        showrooms={showrooms}
      />
      
      {/* Full Image Modal */}
      <Modal
        visible={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        footer={null}
        title="Product Image"
      >
        <img
          src={fullImageUrl}
          alt="Full Product"
          style={{ width: "100%", height: "auto" }}
        />
      </Modal>

      {/* Product Details Modal */}
      <Modal
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        title="Product Details"
        centered
      >
        {selectedProduct && (
          <div style={{ padding: "20px" }}>
            <img
              src={`${backendBaseURL}/Media/Products_Images/${selectedProduct.productImage
                .split("\\")
                .pop()}`}
              alt={selectedProduct.productName}
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
            <h2 style={{ margin: "10px 0", fontWeight: "bold", fontSize: "24px" }}>
              {selectedProduct.productName}
            </h2>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Price:</strong> ₵{selectedProduct.price.toFixed(2)}</p>
            <p><strong>Old Price:</strong> ₵{selectedProduct.oldPrice.toFixed(2)}</p>
            <p><strong>Brand:</strong> {selectedProduct.brandName}</p>
            <p><strong>Showroom:</strong> {selectedProduct.showRoomName}</p>
            <p><strong>Date Created:</strong> {new Date(selectedProduct.dateCreated).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;
