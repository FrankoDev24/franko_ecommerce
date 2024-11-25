import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Dropdown, Menu, Avatar, Modal } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  UserOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getCartById } from '../../Redux/slice/cartSlice';
import { logoutCustomer } from '../../Redux/slice/customerSlice';
import frankoLogo from '../../assets/frankoIcon.png';
import SearchModal from '../SearchModal';
import './Navbar.css';

const AccountDropdown = ({ onLogout, customer }) => {
  const navigate = useNavigate();
  return (
    <Menu>
      <Menu.Item key="firstName">
        <strong>{customer.firstName}</strong>
      </Menu.Item>
      <Menu.Item key="email">
        <span>{customer.email}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        icon={<UserOutlined />}
        onClick={() => navigate('/profile')} // Navigate to /profile
      >
        Profile Settings
      </Menu.Item>
      <Menu.Item icon={<LogoutOutlined />} onClick={onLogout}>
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
    navigate('/');
  };

  const customerDetails =
    currentCustomer || JSON.parse(localStorage.getItem('customerDetails')) || {};
  const isUserLoggedIn = currentCustomer !== null;
  const initials = customerDetails?.firstName?.[0] || '';

  return (
    <div className="flex flex-col w-full sticky-navbar">
      <div className="bg-white py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">
              <img
                src={frankoLogo}
                className="h-12 w-auto object-contain my-2"
                alt="Franko Trading"
              />
            </Link>
          </div>

          {/* Centered Music Icon */}
          <CustomerServiceOutlined
            className="text-2xl text-red-500 cursor-pointer absolute left-1/2 transform -translate-x-1/2"
            onClick={() => setIsMusicModalVisible(true)}
          />

          {/* Action Icons */}
          <div className="flex items-center gap-6">
            {/* Search Icon and Contact in Large View */}
            <div className="flex items-center gap-4">
              <SearchOutlined
                className="text-2xl text-gray-400 cursor-pointer"
                onClick={() => setIsSearchModalOpen(true)}
              />
              <div className="hidden lg:flex flex-col items-end">
                <div className="text-sm text-gray-500">Call Us Now</div>
                <a
                  href="tel:+233302752020"
                  className="text-green-800 font-semibold flex items-center gap-1"
                >
                  <PhoneOutlined />
                  +233 030 2752020
                </a>
              </div>
              <a
                href="https://wa.me/233302752020"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden"
              >
                <PhoneOutlined className="text-xl text-green-800 cursor-pointer" />
              </a>
            </div>

            <div className="flex items-center gap-4 relative">
              {isUserLoggedIn ? (
                <Dropdown
                  overlay={
                    <AccountDropdown onLogout={handleLogout} customer={customerDetails} />
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
                <Button
                  onClick={() => navigate('/sign-in')}
                  className="text-white bg-green-800 hover:bg-green-600"
                >
                  Login
                </Button>
              )}
              <Badge count={totalItems || 0} className="cursor-pointer">
                <ShoppingCartOutlined
                  className="text-xl hover:text-blue-600"
                  onClick={() =>
                    navigate(`/cart/${localStorage.getItem('cartId')}`)
                  }
                />
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
