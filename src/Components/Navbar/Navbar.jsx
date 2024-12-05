import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Dropdown, Menu, Avatar, Modal } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,

  UserOutlined,
  LogoutOutlined,
  CarryOutOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getCartById } from '../../Redux/slice/cartSlice';
import { logoutCustomer } from '../../Redux/slice/customerSlice';
import frankoLogo from '../../assets/frankoIcon.png';
import SearchModal from '../SearchModal';
import './Navbar.css';
import radio from "../../assets/radioss.png";
import HelpNavbar from './HelpNavbar';

const AccountDropdown = ({ onLogout, customer }) => {
  const navigate = useNavigate();
  return (
    <Menu>
      <Menu.Item key="firstName">
      <strong>{customer.firstName + " " + customer.lastName}</strong>

      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        icon={<UserOutlined />}
        onClick={() => navigate('/profile')} // Navigate to /profile
      >
        Profile
      </Menu.Item>
      <Menu.Item
        icon={<CarryOutOutlined />}
        onClick={() => navigate('/order-history')} // Navigate to /profile
      >
        Orders
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
    <HelpNavbar />
    <div className="bg-white py-2 px-4 shadow-sm">
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
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsMusicModalVisible(true)}>
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
            {/* Search Icon (Always Visible) */}
            <SearchOutlined className="text-md lg:text-xl text-gray-400 cursor-pointer mr-2 lg:mr-0" />
            
            {/* Search Input (Hidden on Mobile) */}
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
            <Badge
              count={totalItems} // This is the number of items in the cart
              onClick={() => navigate(`/cart/${localStorage.getItem('cartId')}`)}
              style={{ cursor: 'pointer' }} // Ensure the cursor changes to indicate interactivity
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
