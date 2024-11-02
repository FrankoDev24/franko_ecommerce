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
  CaretDownOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../Redux/slice/categorySlice';
import { fetchBrands } from '../../Redux/slice/brandSlice';
import { getCartById } from '../../Redux/slice/cartSlice';
import { logoutCustomer } from '../../Redux/slice/customerSlice';
import frankoLoge from '../../assets/frankoIcon.png';
import './Navbar.css';

const AccountDropdown = ({ onLogout }) => (
  <Menu>
    <Menu.Item onClick={() => { /* Add profile navigation here */ }}>
      Profile
    </Menu.Item>
    <Menu.Item onClick={onLogout}>
      Logout
    </Menu.Item>
  </Menu>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [isAccountDropdownVisible, setAccountDropdownVisible] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { categories, status } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const currentCustomer = useSelector((state) => state.customer.currentCustomer);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        dispatch(getCartById(cartId));
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId');
    localStorage.removeItem('customerDetails');
    dispatch(logoutCustomer());
    window.location.reload();
  };

  const isUserLoggedIn = !!(localStorage.getItem('userId') || currentCustomer);
  const firstName = currentCustomer?.firstName || JSON.parse(localStorage.getItem('customerDetails'))?.firstName || '';

  return (
    <div className="flex flex-col w-full sticky-navbar">
      <div className="bg-white py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">
              <img src={frankoLoge} className="h-12 w-auto object-contain my-2" alt="Franko Trading" />
            </Link>
          </div>

          <div className="flex-grow mx-8 max-w-2xl hidden md:block">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Enter Keyword or Item"
              prefix={<SearchOutlined className="text-gray-400" />}
              suffix={searchValue ? (
                <CloseOutlined className="text-gray-400 cursor-pointer" onClick={() => setSearchValue('')} />
              ) : null}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-sm text-gray-500">Call Us Now</div>
              <div className="text-green-800 font-semibold flex items-center gap-1">
                <PhoneOutlined />
                +233 030 2752020
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              <div className="flex items-center gap-4 md:hidden">
                <SearchOutlined
                  className="text-xl text-gray-400 cursor-pointer"
                  onClick={() => setIsSearchModalOpen(true)}
                />
                <PhoneOutlined className="text-xl text-green-800 cursor-pointer" />
              </div>

              {isUserLoggedIn ? (
                <>
                  <div className="text-red-600 font-semibold">
                    Hello, {firstName}!
                  </div>
                  <Dropdown 
                    overlay={<AccountDropdown onLogout={handleLogout} />} 
                    trigger={['hover']}
                    visible={isAccountDropdownVisible}
                    onMouseEnter={() => setAccountDropdownVisible(true)}
                    onMouseLeave={() => setAccountDropdownVisible(false)}
                  >
                    <HeartOutlined className="text-xl cursor-pointer hover:text-blue-600" />
                  </Dropdown>
                </>
              ) : (
                <Button 
                  onClick={() => navigate('/sign-in')} 
                  className="text-white bg-green-800 hover:bg-green-600"
                >
                  Login
                </Button>
              )}

              <Badge count={totalItems || 0} className="cursor-pointer">
                <ShoppingCartOutlined className="text-xl hover:text-blue-600" onClick={() => navigate(`/cart/${localStorage.getItem('cartId')}`)} />
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={isSearchModalOpen}
        footer={null}
        onCancel={() => setIsSearchModalOpen(false)}
        title="Search"
      >
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter Keyword or Item"
          prefix={<SearchOutlined className="text-gray-400" />}
          suffix={searchValue ? (
            <CloseOutlined className="text-gray-400 cursor-pointer" onClick={() => setSearchValue('')} />
          ) : null}
          className="w-full"
        />
      </Modal>

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
                  overlay={(
                    <Menu>
                      {brands.filter((brand) => brand.categoryId === category.categoryId).map((brand) => (
                        <Menu.Item key={brand.brandId} onClick={() => navigate(`/brand/${brand.brandId}`)}>
                          {brand.brandName}
                        </Menu.Item>
                      ))}
                    </Menu>
                  )}
                  trigger={['hover']}
                >
                  <span className="px-4 py-3 hover:bg-red-600 cursor-pointer flex items-center gap-2 whitespace-nowrap text-white no-underline">
                    {category.categoryName}
                  </span>
                </Dropdown>
              ))
            )}
          </div>
        </div>
      </div>

      <Drawer
        title="Categories"
        placement="left"
        width={250}
        onClose={() => setIsMenuOpen(false)}
        visible={isMenuOpen}
      >
        {categories.map((category) => (
          <div key={category.categoryId} className="p-4 border-b border-gray-200">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedCategoryId(expandedCategoryId === category.categoryId ? null : category.categoryId)}
            >
              <span>{category.categoryName}</span>
              {expandedCategoryId === category.categoryId ? <CloseOutlined /> : <CaretDownOutlined />}
            </div>
            {expandedCategoryId === category.categoryId && (
              <Menu>
                {brands.map((brand) => brand.categoryId === category.categoryId && (
                  <Menu.Item key={brand.brandId} onClick={() => navigate(`/brand/${brand.brandId}`)}>
                    {brand.brandName}
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default Navbar;
