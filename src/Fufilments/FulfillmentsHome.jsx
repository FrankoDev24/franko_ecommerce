import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const FulfillmentHome = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const fullName = user?.fullName || 'Guest';


  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'home') {
      navigate('/fulfillment/dashboard');
    }
    // Handle other menu items similarly...
  };

  

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = () => {
    // Redirect to the login page
    navigate('/admin/login');
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
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
            {collapsed ? 'FM' : 'Fulfillment Manager'}
          </Title>
        </div>
        <Menu

  mode="inline"
  onClick={handleMenuClick}
  style={{ marginTop: 10, backgroundColor: '#4FB477', color: 'white' }} // Green background color
>
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            <Link to="/fulfillment/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<UserOutlined />}>
            <Link to="/fulfillment/orders">Orders</Link>
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
              Fulfillment Manager
            </Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Home Icon to navigate to home */}
            <HomeOutlined
              style={{ fontSize: '24px', cursor: 'pointer' }}
              onClick={() => navigate('/home')}
            />
            
         
              <Button type="link"  style={{ padding: 0 }}>
                Hi, {fullName}
              </Button>
      
            <Button type="link" onClick={() => navigate('/admin/profile')}>
              Profile
            </Button>
            <Button type="primary" danger onClick={showLogoutModal}>
              Logout
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: '10px',
            marginTop: 20,
            minHeight: 'auto',
    
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

      {/* Logout Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={handleCancelLogout}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </Layout>
  );
};

export default FulfillmentHome;
