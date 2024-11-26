import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { DashboardOutlined, ShoppingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const AgentHome = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: '90vh' }}>
      {/* Sidebar for agent */}
      <Sider
        width={170}
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
       
      >
        {/* Collapse Button (visible on mobile view) */}
        <Button
         
          onClick={toggleCollapse}
        className='bg-green-800 hover:bg-green-900 text-white '
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>

        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item
            key="1"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/agent-dashboard')}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/agent-dashboard/orders')}
          >
            Orders
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Layout style={{ padding: '0 20px 20px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 200,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AgentHome;
