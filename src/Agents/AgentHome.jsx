import React, { useState } from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Title } = Typography;

const GREEN_COLOR = "#3F6634";

const AgentHome = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  // Get current location

  const toggleCollapse = () => setCollapsed(!collapsed);

  // Function to determine the active menu item based on the current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/orders')) {
      return '2';  // Orders
    }
    return '1';  // Dashboard
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Sidebar */}
      <Sider
        width={200}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
        style={{
          backgroundColor: GREEN_COLOR,
          boxShadow: '4px 0 5px rgba(0,0,0,0.2)',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: 65,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '0 16px',
            backgroundColor: GREEN_COLOR,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
            transition: 'all 0.3s ease',
          }}
        >
          {!collapsed && <Title level={5} style={{ margin: 0, color: 'white' }}>Agent Panel</Title>}
          <Button
            type="text"
            onClick={toggleCollapse}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
              color: 'white',
              fontSize: 16,
            }}
          />
        </div>

        {/* Sidebar Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}  // Dynamically set active tab based on location
          style={{
            height: '100%',
            borderRight: 0,
            backgroundColor: GREEN_COLOR,
            color: 'white',
          }}
          theme="dark"
        >
          <Menu.Item
            key="1"
            icon={<DashboardOutlined style={{ color: 'white' }} />}
            onClick={() => navigate('/agent-dashboard')}
            style={{
              margin: '8px 0',
              color: 'white',
            }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<ShoppingOutlined style={{ color: 'white' }} />}
            onClick={() => navigate('/agent-dashboard/orders')}
            style={{
              margin: '8px 0',
              color: 'white',
            }}
          >
            Orders
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content Area */}
      <Layout>
        <Content
          style={{
            padding: 20,
            margin: 0,
            backgroundColor: '#fff',
            boxShadow: '0px 3px 3px rgba(0,0,0,0.1)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AgentHome;
