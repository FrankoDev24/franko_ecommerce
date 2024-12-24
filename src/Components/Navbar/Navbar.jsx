import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge,  Dropdown, Menu, Avatar, Modal } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  CarryOutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getCartById } from '../../Redux/slice/cartSlice';
import { logoutCustomer } from '../../Redux/slice/customerSlice';
import frankoLogo from '../../assets/frankoIcon.png';
import SearchModal from '../SearchModal';
import './Navbar.css';
import radio from '../../assets/radioss.png';
import HelpNavbar from './HelpNavbar';

const AccountDropdown = ({ onLogout, customer, onClose = () => {} }) => {
  const navigate = useNavigate();

  const handleOrdersNavigation = () => {
    const customerDetails = JSON.parse(localStorage.getItem('customer')) || {};
    const accountType = customerDetails?.accountType;

    if (accountType === 'agent') {
      navigate('/agent-dashboard/orders');
    } else {
      navigate('/order-history');
    }
    onClose(); // Close the menu
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    onClose(); // Close the menu
  };

  const handleLogout = () => {
    onLogout();
    onClose(); // Close the menu
  };

  return (
    <Menu onClick={onClose}>
      <Menu.Item key="firstName">
        <strong>{customer.firstName + ' ' + customer.lastName}</strong>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<UserOutlined />} onClick={handleProfileNavigation}>
        Profile
      </Menu.Item>
      <Menu.Item icon={<CarryOutOutlined />} onClick={handleOrdersNavigation}>
        Orders
      </Menu.Item>
      <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

const Navbar = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAccountDropdownVisible, setAccountDropdownVisible] = useState(false);
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false); // Music modal visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = useSelector((state) => state.cart.totalItems);
  const currentCustomer = useSelector((state) => state.customer.currentCustomer);

  useEffect(() => {
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
    navigate('/home');
  };

  const customerDetails =
    currentCustomer || JSON.parse(localStorage.getItem('customerDetails')) || {};
  const isUserLoggedIn = currentCustomer !== null;
  const initials = customerDetails?.firstName?.[0] || '';

  const GuestDropdown = () => (
    <Menu>
      <Menu.Item
        key="login"
        icon={<LoginOutlined />}
        onClick={() => navigate('/sign-in')}
      >
        Login
      </Menu.Item>
      <Menu.Item
        key="register"
        icon={<UserAddOutlined />}
        onClick={() => navigate('/sign-up')}
      >
        Register
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex flex-col w-full sticky-navbar">
      <HelpNavbar />
      <div className="bg-white py-1 px-2 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">
              <img
                src={frankoLogo}
                className="h-12 md:h-12 w-auto object-contain my-2"
                alt="Franko Trading"
              />
            </Link>
          </div>

          {/* Centered Radio Icon with "Live Now" */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsMusicModalVisible(true)}
          >
            <img
              src={radio}
              className="h-8 w-8 object-contain my-2"
              alt="Franko Online Radio"
            />
            <span className="text-xs font-semibold text-red-400">Live Now</span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon and Input */}
            <div
              className="flex items-center bg-gray-100 rounded-full px-2 py-2 w-full max-w-xs lg:max-w-md cursor-pointer"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <SearchOutlined className="text-md lg:text-xl text-gray-400 cursor-pointer mr-2 lg:mr-0" />
              <input
                type="text"
                className="hidden lg:block bg-transparent border-none outline-none w-full text-gray-500"
                placeholder="Search..."
              />
            </div>

            {/* User Account and Cart */}
            <div className="flex items-center gap-4 relative">
              {isUserLoggedIn ? (
                <Dropdown
                  overlay={
                    <AccountDropdown
                      onLogout={handleLogout}
                      customer={customerDetails}
                    />
                  }
                  trigger={['click']}
                  visible={isAccountDropdownVisible}
                  onVisibleChange={(visible) => setAccountDropdownVisible(visible)}
                >
                  <div className="flex items-center cursor-pointer">
                    <Avatar className="bg-green-800">{initials}</Avatar>
                  </div>
                </Dropdown>
              ) : (
                <Dropdown overlay={<GuestDropdown />} trigger={['click']}>
                  <div className="flex items-center cursor-pointer">
                    <Avatar icon={<UserOutlined />} className="bg-green-600" />
                  </div>
                </Dropdown>
              )}
              <Badge
                count={totalItems}
                onClick={() => navigate(`/cart/${localStorage.getItem('cartId')}`)}
                style={{ cursor: 'pointer' }}
              >
                <ShoppingCartOutlined className="text-xl hover:text-blue-600" />
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        visible={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Music Modal */}
      <Modal
        title="Franko Online Radio"
        visible={isMusicModalVisible}
        onCancel={() => setIsMusicModalVisible(false)}
        footer={null}
      >
        <a
          href="https://s48.myradiostream.com/:13420/listen.mp3?nocache=1723816422"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline"
        >
          Click here to listen
        </a>
      </Modal>
    </div>
  );
};

export default Navbar;
