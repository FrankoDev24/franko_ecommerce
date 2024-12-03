import React, { useState } from 'react';
import { Layout, Menu, Avatar, Button, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ContentManagerPage = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'home') {
      navigate('/content/dashboard');
    }
    // Handle other menu items similarly...
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        breakpoint="lg"
        trigger={null}
        width={240}
        style={{
          position: 'fixed',
          height: '100vh',
          backgroundColor: '#4FB477',
        }}
      >
        <div className="logo text-center p-4">
          <Title level={5} style={{ color: 'white' }}>
            {collapsed ? 'CM' : 'Content Manager'}
          </Title>
        </div>
        <Menu
        
          mode="inline"
          onClick={handleMenuClick}
          style={{ marginTop: 10 }}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/content/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="products" icon={<UserOutlined />}>
            <Link to="/content/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="brands" icon={<FileTextOutlined />}>
            <Link to="/content/brands">Brands</Link>
          </Menu.Item>
          <Menu.Item key="category" icon={<FileTextOutlined />}>
            <Link to="/content/category">Category</Link>
          </Menu.Item>
          <Menu.Item key="showroom" icon={<FileTextOutlined />}>
            <Link to="/content/showroom">Showroom</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin 0.2s' }}>
        {/* Header */}
        <Header
          className="bg-white shadow-md"
          style={{
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="link"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              style={{ marginRight: 16 }}
            />
            <Title level={4} style={{ margin: 0 }}>
              Content Manager
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar icon={<UserOutlined />} />
            <Button type="link" onClick={() => navigate('/admin/profile')}>
              Profile
            </Button>
            <Button type="primary" danger onClick={() => navigate('/admin/logout')}>
              Logout
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: '15px',
            marginTop: 30,
            minHeight:"auto",
            backgroundColor: '#f0f2f5',
          }}
        >
          <div
            style={{
  
              padding: 5,
         
           
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ContentManagerPage;
