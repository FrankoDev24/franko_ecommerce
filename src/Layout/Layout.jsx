import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Modal, Typography } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  TrademarkOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined 
} from '@ant-design/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/slice/userSlice';
import './Layout.css'; // Custom CSS for additional styling

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const currentPath = location.pathname;

  // Access user information from Redux store
  const user = useSelector((state) => state.user.userData);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsLogoutModalVisible(false);
    navigate('/login');
  };

  const handleCancel = () => {
    setIsLogoutModalVisible(false);
  };

  const menuItems = [
    { key: '/admin/dashboard', icon: <ShopOutlined />, label: 'Dashboard', link: '/admin/dashboard' },
    { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: 'Orders', link: '/admin/orders' },
    { key: '/admin/categories', icon: <TagsOutlined />, label: 'Categories', link: '/admin/categories' },
    { key: '/admin/products', icon: <AppstoreOutlined />, label: 'Products', link: '/admin/products' },
    { key: '/admin/brands', icon: <TrademarkOutlined />, label: 'Brands', link: '/admin/brands' },
    { key: '/admin/showroom', icon: <ShopOutlined />, label: 'Showroom', link: '/admin/showroom' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Users', link: '/admin/users' },
    { key: '/admin/customers', icon: <UsergroupAddOutlined />, label: 'Customers', link: '/admin/customers' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', action: showLogoutModal },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/admin/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={showLogoutModal}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={{ 
          position: 'fixed', 
          height: '100vh', 
          left: 0, 
          top: 0, 
          zIndex: 10 
        }}
      >
        <div className="logo" style={{ padding: '16px', color: '#fff', textAlign: 'center' }}>
          {collapsed ? 'Admin' : 'Admin Panel'}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[currentPath]}>
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={item.action ? item.action : null}
            >
              {item.link ? <Link to={item.link}>{item.label}</Link> : item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            position: 'fixed',
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
            zIndex: 9,
          }}
        >
          <Button type="link" onClick={toggleCollapsed} style={{ fontSize: '16px' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <div style={{ float: 'right', paddingRight: '20px', display: 'flex', alignItems: 'center' }}>
            <Dropdown overlay={userMenu}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </Dropdown>
            <span style={{ marginLeft: '20px' }}>Hello, {user ? user.fullName : 'Admin'}</span>
          </div>
        </Header>

        <Content
          style={{
            margin: '80px 16px 24px',
            padding: 24,
            minHeight: 280,
            backgroundColor: '#fff',
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Logout Modal */}
      <Modal
        visible={isLogoutModalVisible}
        footer={null}
        centered
        closable={false}
        bodyStyle={{ padding: '10px', textAlign: 'center' }}
      >
        <Text style={{ fontSize: '16px' }}>
          Are you sure you want to log out?
        </Text>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            style={{ width: '120px' }}
          >
            Yes, Logout
          </Button>
          <Button
            type="default"
            onClick={handleCancel}
            style={{ width: '120px' }}
          >
            Cancel
          </Button>
        </div>
      </Modal>

    </Layout>
  );
};

export default AdminLayout;
