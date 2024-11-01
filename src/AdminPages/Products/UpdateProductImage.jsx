import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductImage, fetchProductById } from '../../Redux/slice/productSlice'; // Adjust the import path as needed
import { Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UpdateProductImage = () => {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch product details from the Redux state
  const product = useSelector((state) => state.products.product); // Assuming you have a product slice that holds the product details

  useEffect(() => {
    if (productId) {
      // Fetch product details by ID when productId changes
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  // Update image when the product details change
  useEffect(() => {
    if (product && product.productImage) {
      setImagePreview(product.productImage); // Set existing image for preview
    }
  }, [product]);

  const handleUploadChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      const { originFileObj } = info.file;
      setProductImageFile(originFileObj);
      setImagePreview(URL.createObjectURL(originFileObj));
      setUploading(false);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setProductImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      return false; // Prevent automatic upload
    },
    onChange: handleUploadChange,
    showUploadList: false,
    progress: {
      onProgress: ({ percent }) => setUploadProgress(percent),
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate inputs
    if (!productId || !productImageFile) {
      setError('Both fields are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ProductId', productId);
      formData.append('productImage', productImageFile);

      // Dispatch update action
      await dispatch(updateProductImage(formData)).unwrap();
      setSuccess(true);
      // Optionally, reset form fields
      setProductId('');
      setProductImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError('Failed to update product image: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4">Update Product Image</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">Image updated successfully!</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productId">
            Product ID
          </label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Existing Image</label>
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Current" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload New Image</label>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
          {uploading && <Progress percent={uploadProgress} status="active" />}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductImage;
