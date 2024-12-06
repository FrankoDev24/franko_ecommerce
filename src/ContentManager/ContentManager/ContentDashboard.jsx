import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../Redux/slice/productSlice';
import { fetchBrands } from '../../Redux/slice/brandSlice';
import { fetchCategories } from '../../Redux/slice/categorySlice';
import { fetchShowrooms } from '../../Redux/slice/showRoomSlice';
import { ShoppingCartOutlined, AppstoreAddOutlined, ClusterOutlined, HomeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

function ContentDashboard() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.categories);
  const { showrooms } = useSelector((state) => state.showrooms);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    dispatch(fetchShowrooms());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center text-red-500">Content Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Count */}
        <Tooltip title="Total products available">
          <div className="border p-6 rounded-lg shadow-lg text-center bg-white hover:bg-blue-50 transition-all">
            <ShoppingCartOutlined className="text-xl text-blue-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-600">Total Products</h2>
            <p className="text-3xl font-semibold text-blue-500">{products.length}</p>
          </div>
        </Tooltip>

        {/* Brands Count */}
        <Tooltip title="Total brands in the system">
          <div className="border p-6 rounded-lg shadow-lg text-center bg-white hover:bg-green-50 transition-all">
            <AppstoreAddOutlined className="text-xl text-green-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-600">Total Brands</h2>
            <p className="text-3xl font-semibold text-green-500">{brands.length}</p>
          </div>
        </Tooltip>

        {/* Categories Count */}
        <Tooltip title="Total categories available">
          <div className="border p-6 rounded-lg shadow-lg text-center bg-white hover:bg-yellow-50 transition-all">
            <ClusterOutlined className="text-xl text-yellow-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-600">Total Categories</h2>
            <p className="text-3xl font-semibold text-yellow-500">{categories.length}</p>
          </div>
        </Tooltip>

        {/* Showrooms Count */}
        <Tooltip title="Total showrooms listed">
          <div className="border p-6 rounded-lg shadow-lg text-center bg-white hover:bg-red-50 transition-all">
            <HomeOutlined className="text-xl text-red-500 mb-4" />
            <h2 className="text-xl font-medium text-gray-600">Total Showrooms</h2>
            <p className="text-3xl font-semibold text-red-500">{showrooms.length}</p>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default ContentDashboard;
