import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Avatar } from 'antd';
import { PhoneOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the user data from local storage
    const userData = JSON.parse(localStorage.getItem('customer')) || {};
    setUser(userData);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="user-profile-page"
      style={{
        padding: '40px',
        
      }}
    >
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={16} xl={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            {/* User Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={user.imagePath || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                style={{ backgroundColor: '#1890ff', marginBottom: '10px' }}
              />
            </div>

            {/* User Information */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={3} style={{ marginBottom: '10px', color: '#333' }}>
                {user.firstName} {user.lastName}
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#555', marginBottom: '5px' }}>
                <MailOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                {user.email}
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', color: '#555' }}>
                <PhoneOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                {user.contactNumber}
              </Paragraph>
            </div>

            {/* User Account Info */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card
                  bordered
                  style={{
                    textAlign: 'center',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Title level={5} style={{ color: '#595959' }}>
                    Contact Number
                  </Title>
                  <Paragraph style={{ fontSize: '16px', color: '#333' }}>{user.contactNumber}</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  bordered
                  style={{
                    textAlign: 'center',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Title level={5} style={{ color: '#595959' }}>
                    Account Number
                  </Title>
                  <Paragraph style={{ fontSize: '16px', color: '#333' }}>
                    {user.customerAccountNumber || 'N/A'}
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            {/* Edit Profile Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
             
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
