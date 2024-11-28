import React from 'react';
import { Input, Button } from 'antd';
import { MailOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="w-full bg-gray-800 text-white py-4 px-4">
      {/* Newsletter Section */}
      <div className="bg-green-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-white">
            <div className="flex items-center gap-2">
              <MailOutlined className="text-lg" />
              <h3 className="font-bold text-base">Get Special Offers and Savings</h3>
            </div>
            <p className="text-xs">Get all the latest information on Events, Sales and Offers.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Input
              placeholder="Email Address"
              className="max-w-xs h-8"
            />
            <Button type="primary" className="bg-white text-blue-500 hover:bg-gray-100 h-8 flex items-center">
              GO!
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 py-4 px-4">
        {/* Logo and Description */}
        <div className="md:col-span-2">
          <img src={require('../../assets/frankoIcon.png')} alt="Franko Trading" className="h-32" />
          <p className="text-gray-300 text-sm">
            Your premier retail and wholesale outlet for phones and accessories
          </p>
          {/* Questions Section */}
          <div className="mt-2">
            <div className="text-xs font-bold">QUESTIONS?</div>
            <div>
              <a href="tel:+233555939311" className="text-white text-sm font-bold">
                +233 55 593 9311
              </a>
            </div>
            <Button
              type="primary"
              size="small"
              className="bg-green-700 flex items-center gap-2"
              onClick={() => window.open('https://wa.me/0555939311', '_blank')}
            >
              <FaWhatsapp className="text-lg text-white hover:text-green-700 cursor-pointer" />
              Chat Online
            </Button>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Company */}
          <div>
            <h4 className="font-bold text-sm mb-2">COMPANY</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white text-sm">Terms</Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-sm mb-2">ACCOUNT</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/order-history" className="text-gray-300 hover:text-white text-sm">Order History</Link>
              </li>
              <li>
                <Link to="/sign-up" className="text-gray-300 hover:text-white text-sm">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Orders */}
          <div>
            <h4 className="font-bold text-sm mb-2">ORDERS</h4>
            <ul className="space-y-1">
              <li>Delivery Info</li>
              <li>Returns Policy</li>
              <li>Payment</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-2 border-t border-gray-700">
          <div className="text-gray-400 text-xs">
            © Franko Trading Ltd 2024. All Rights Reserved
          </div>
          <div className="flex gap-3 mt-2 md:mt-0">
            <a href="https://www.facebook.com/frankotradingenterprise" target="_blank" rel="noopener noreferrer">
              <FacebookOutlined className="text-lg hover:text-blue-400 cursor-pointer" />
            </a>
            <a href="https://x.com/frankotrading1" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined className="text-lg hover:text-blue-400 cursor-pointer" />
            </a>
            <a href="https://www.tiktok.com/@frankotrading" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="text-lg hover:text-blue-400 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
