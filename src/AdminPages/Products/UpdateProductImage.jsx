import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductImage, fetchProductById } from '../../Redux/slice/productSlice'; // Adjust import path
import { Upload, Button, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UpdateProductImage = () => {
  const dispatch = useDispatch();

  // Local state for input management
  const [productId, setProductId] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redux state for loading, product data, and error handling
  const { product, loading, error, success } = useSelector((state) => state.products);

  // Fetch product details when the product ID changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  // Set image preview from the product data if available
  useEffect(() => {
    if (product && product.productImage) {
      setImagePreview(product.productImage);
    }
  }, [product]);

  // Handle file selection for image upload
  const handleUploadChange = (info) => {
    console.log('Upload info:', info); // Log the upload status
    if (info.file.status === 'uploading') {
      setUploading(true);
      message.loading(`${info.file.name} is uploading...`);
    }
    if (info.file.status === 'done') {
      setProductImageFile(info.file.originFileObj);
      setImagePreview(URL.createObjectURL(info.file.originFileObj));
      setUploading(false);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Upload configuration with validation for file type and size
  const uploadProps = {
    beforeUpload: (file) => {
      // Validate file type (JPG, JPEG, PNG)
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidExtension = /\.(jpg|jpeg|png)$/i.test(file.name);
      if (!isValidType || !isValidExtension) {
        message.error('You can only upload JPG, JPEG, or PNG files!');
        return Upload.LIST_IGNORE; // Reject the file
      }

      // Validate file size (Max 5MB)
      const isValidSize = file.size / 1024 / 1024 < 5; // Max size 5MB
      if (!isValidSize) {
        message.error('File size must be less than 5MB!');
        return Upload.LIST_IGNORE; // Reject the file
      }

      // If file passes validation, set image preview and file
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

  // Handle form submission for updating the image
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!productId || !productImageFile) {
      message.error('Both Product ID and Image are required!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ProductId', productId);  // Correct field name to 'ProductId'
      formData.append('ImageName', productImageFile);  // Append the file (image)

      // Dispatch the update action
      await dispatch(updateProductImage(formData)).unwrap();

      // If successful, fetch the updated product to display the new image
      dispatch(fetchProductById(productId));

      message.success('Product image updated successfully!');
      setProductId('');
      setProductImageFile(null);
      setImagePreview(null);
    } catch (err) {
      message.error('Failed to update product image: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4">Update Product Image</h2>

      {/* Success/Failure Message */}
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

        {/* Image Preview */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Existing Image</label>
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Current" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}

          {/* Image Upload Section */}
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload New Image</label>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>

          {/* Upload Progress */}
          {uploading && <Progress percent={uploadProgress} status="active" />}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Image'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductImage;
