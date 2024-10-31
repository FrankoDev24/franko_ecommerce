import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Badge, Button, Drawer, Dropdown, Menu, Modal } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  PhoneOutlined,
  CaretDownOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../Redux/slice/categorySlice';
import { fetchBrands } from '../../Redux/slice/brandSlice';
import { getCartById } from '../../Redux/slice/cartSlice';
import frankoLoge from "../../assets/frankoIcon.png";
import "./Navbar.css"

// Component for Account Dropdown
const AccountDropdown = ({ isVisible, setIsVisible }) => {
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId');
    localStorage.removeItem('user');
    // Redirect or refresh page after logout
  };

  return (
    <Menu>
      <Menu.Item onClick={() => { setIsVisible(false); /* Navigate to profile */ }}>
        Profile
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // Modal state for search
  const [searchValue, setSearchValue] = useState('');
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null); // Track expanded category in mobile drawer
  const [firstName, setFirstName] = useState('');
  const [isAccountDropdownVisible, setAccountDropdownVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, status } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const totalItems = useSelector((state) => state.cart.totalItems);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        dispatch(getCartById(cartId));
      }
    }

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
    const filteredBrands = brands.filter((brand) => brand.categoryId === categoryId);
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
    const transactionNumber = localStorage.getItem('transactionNumber');
    if (transactionNumber) {
      navigate(`/cart/${transactionNumber}`);
    } else {
      console.error("No transaction number found in local storage.");
    }
  };

  const handleCategoryClickMobile = (categoryId) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null); // Collapse if clicked again
    } else {
      setExpandedCategoryId(categoryId); // Expand the selected category
      dispatch(fetchBrands(categoryId)); // Fetch brands for the selected category
    }
  };

  return (
    <div className="flex flex-col w-full sticky-navbar">
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

          {/* Desktop search bar */}
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
            <div className="flex items-center gap-4 relative">
              {firstName && (
                <div className="text-blue-600 font-semibold">
                  Hello, {firstName}!
                </div>
              )}
              <div onMouseEnter={() => setAccountDropdownVisible(true)} onMouseLeave={() => setAccountDropdownVisible(false)}>
                
                <Dropdown 
                  overlay={<AccountDropdown isVisible={isAccountDropdownVisible} setIsVisible={setAccountDropdownVisible} />} 
                  trigger={['hover']}
                  visible={isAccountDropdownVisible}
                >
                  
                  <HeartOutlined className="text-xl cursor-pointer hover:text-blue-600" />
                </Dropdown>
              </div>
              <div className="bg-white px-4 py-2 md:hidden flex justify-between">
        <PhoneOutlined className="text-xl text-blue-600 cursor-pointer" />
        <SearchOutlined
          className="text-xl text-gray-400 cursor-pointer"
          onClick={() => setIsSearchModalOpen(true)}
        />
      </div>
              <Badge count={totalItems || 0} className="cursor-pointer">
                <ShoppingCartOutlined className="text-xl hover:text-blue-600" onClick={handleCartClick} />
              </Badge>
                 {/* Mobile call and search icons */}
    

            </div>
          </div>
        </div>
      </div>

   
      {/* Search modal for mobile */}
      <Modal
        visible={isSearchModalOpen}
        footer={null}
        onCancel={() => setIsSearchModalOpen(false)}
        title="Search"
      >
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
      </Modal>

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
            Categories
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
        width={250}
        onClose={() => setIsMenuOpen(false)}
        visible={isMenuOpen}
        bodyStyle={{ padding: 0 }}
      >
        {categories.map((category) => (
          <div key={category.categoryId} className="p-4 border-b border-gray-200">
            <div
              onClick={() => handleCategoryClickMobile(category.categoryId)}
              className="flex justify-between items-center"
            >
              <span>{category.categoryName}</span>
              {expandedCategoryId === category.categoryId ? (
                <CloseOutlined />
              ) : (
                <CaretDownOutlined />
              )}
            </div>
            {expandedCategoryId === category.categoryId && (
              <div className="pl-4">
                {brands
                  .filter((brand) => brand.categoryId === category.categoryId)
                  .map((brand) => (
                    <div
                      key={brand.brandId}
                      className="py-2 cursor-pointer hover:text-blue-600"
                      onClick={() => {
                        navigate(`/brand/${brand.brandId}`);
                        setIsMenuOpen(false);
                      }}
                    >
                      {brand.brandName}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default Navbar;
