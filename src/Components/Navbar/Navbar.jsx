import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Input, Badge, Button, Drawer, Dropdown, Menu } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../Redux/slice/categorySlice';
import { fetchBrands } from '../../Redux/slice/brandSlice'; 
import { getCartById } from '../../Redux/slice/cartSlice';
import frankoLoge from "../../assets/frankoIcon.png";

const AccountDropdown = ({ isVisible, setIsVisible }) => {
  // Implement your AccountDropdown logic here
  return null; // Return the dropdown JSX here
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);

  const [firstName, setFirstName] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { categories, status } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands); 
  const totalItems = useSelector((state) => state.cart.totalItems);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    if (userId) {
      const cartId = localStorage.getItem('cartId'); // Replace with actual method to get cart ID
      if (cartId) {
        dispatch(getCartById(cartId)); // Fetch cart items on mount
      }
    }

    // Retrieve the first name from local storage if available
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.firstName) {
      setFirstName(user.firstName);
    }
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const handleMouseEnter = (categoryId) => {
    setHoveredCategoryId(categoryId);
    dispatch(fetchBrands(categoryId)); 
  };

  const handleMouseLeave = () => {
    setHoveredCategoryId(null); 
  };

  const brandMenu = (categoryId) => {
    const filteredBrands = brands.filter(brand => brand.categoryId === categoryId);
  
    return (
      <Menu>
        {filteredBrands.map((brand) => (
          <Menu.Item key={brand.brandId} onClick={() => navigate(`/brand/${brand.brandId}`)}> 
            {brand.brandName}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const handleCartClick = () => {
    const transactionNumber = localStorage.getItem('transactionNumber'); // Retrieve transaction number from local storage
    if (transactionNumber) {
      navigate(`/cart/${transactionNumber}`); // Navigate to cart details based on transaction number
    } else {
      console.error("No transaction number found in local storage."); // Log error if no transaction number is found
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top bar */}
      <div className="bg-white py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">
              <img
                src={frankoLoge}
                className="h-12 w-auto object-contain my-2"
                alt="Franko Trading"
              />
            </Link>
          </div>

          <div className="flex-grow mx-8 max-w-2xl hidden md:block">
            <Input
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Enter Keyword or Item"
              prefix={<SearchOutlined className="text-gray-400" />}
              suffix={
                searchValue ? 
                <CloseOutlined 
                  className="text-gray-400 cursor-pointer" 
                  onClick={clearSearch}
                /> : null
              }
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-sm text-gray-500">Call Us Now</div>
              <div className="text-blue-600 font-semibold flex items-center gap-1">
                <PhoneOutlined />
                +233 030 2752020
              </div>
            </div>
            <div className="flex items-center gap-4">
              {firstName && (
                <div className="text-blue-600 font-semibold">
                  Hello, {firstName}!
                </div>
              )}
              <HeartOutlined className="text-xl cursor-pointer hover:text-blue-600" />
              <Badge count={totalItems || 0} className="cursor-pointer">
                <ShoppingCartOutlined className="text-xl hover:text-blue-600" onClick={handleCartClick} />
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="bg-white px-4 py-2 md:hidden">
        <Input
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Enter Keyword or Item"
          prefix={<SearchOutlined className="text-gray-400" />}
          suffix={
            searchValue ? 
            <CloseOutlined 
              className="text-gray-400 cursor-pointer" 
              onClick={clearSearch}
            /> : null
          }
          className="w-full"
        />
      </div>

      {/* Navigation menu */}
      <div className="bg-red-500 text-white items-start">
        <div className="max-w-7xl mx-auto">
          <div className="md:hidden p-4">
            <Button 
              type="text" 
              icon={<MenuOutlined className="text-white" />}
              onClick={() => setIsMenuOpen(true)}
              className="text-white"
            />
          </div>

          <div className="hidden md:flex items-start overflow-x-auto">
            {status === 'loading' ? (
              <p>Loading categories...</p>
            ) : (
              categories.map((category) => (
                <Dropdown
                  key={category.categoryId}
                  overlay={brandMenu(category.categoryId)}
                  onMouseEnter={() => handleMouseEnter(category.categoryId)}
                  onMouseLeave={handleMouseLeave}
                  trigger={['hover']}
                >
                  <span
                    className="px-4 py-3 hover:bg-red-600 cursor-pointer flex items-center gap-2 whitespace-nowrap text-white no-underline"
                  >
                    <span>{category.categoryName}</span> 
                  </span>
                </Dropdown>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width={280}
      >
        <div className="flex flex-col">
          {categories.map((category) => (
            <span
              key={category.categoryId}
              className="py-3 px-4 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-gray-700 no-underline"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{category.categoryName}</span>
            </span>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
