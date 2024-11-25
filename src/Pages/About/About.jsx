import { Layout, Row, Col, Typography, Card, Divider, Tabs } from 'antd';
import { DollarOutlined, RocketOutlined, CustomerServiceOutlined, VerifiedOutlined } from '@ant-design/icons';
import franko from "../../assets/franko_office.png";
import franco from "../../assets/franko_office2.png";

const About = () => {
  const { Content } = Layout;
  const { Title, Paragraph } = Typography;
  const { TabPane } = Tabs;

  return (
    <>
      <title>Franko | About</title>
      <meta
        name="description"
        content="Franko Trading | Your trusted online store for quality gadgets, phones, laptops, and accessories."
      />
      <Layout>
        <Content style={{ padding: '20px' }}>
          <div className="site-layout-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* About Section */}
            <Row gutter={[32, 32]} style={{ marginTop: '40px', alignItems: 'center' }}>
              <Col xs={24} md={14}>
                <Title level={2} style={{ color: '#D7263D' }}>About Us</Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Franko Trading Enterprise is the leading retail and wholesale company of mobile phones, computers,
                  laptops, televisions, and accessories. Established in 2004, we are committed to bringing the latest
                  technological gadgets to Ghana at affordable prices. Our head office is located at Adabraka Opposite Roxy Cinema in Accra.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Known as "Phone Papa Fie" (Home of Quality Phones), we ensure quality and affordability for every Ghanaian.
                </Paragraph>
              </Col>
              <Col xs={24} md={10}>
                <img
                  src={franko}
                  alt="Franko Trading Store"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </Col>
            </Row>

            {/* Tabs Section */}
            <Row gutter={[32, 32]} style={{ marginTop: '40px' }}>
              <Col xs={24} md={10}>
                <img
                  src={franco}
                  alt="Franko Office"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </Col>
              <Col xs={24} md={14}>
                <Tabs defaultActiveKey="1" type="line" centered>
                  <TabPane tab="Vision" key="1">
                    <Title level={4} style={{ color: '#D7263D' }}>Our Vision</Title>
                    <Paragraph>
                      To devote our human and technological resources to create superior household electronics and
                      mobile phone markets through research and innovation in Ghana and the West African Sub-region.
                    </Paragraph>
                  </TabPane>
                  <TabPane tab="Mission" key="2">
                    <Title level={4} style={{ color: '#D7263D' }}>Our Mission</Title>
                    <Paragraph>
                      To be the leader in inspiring Africa and the world with innovative products and designs,
                      revolutionizing the electronics and mobile phone market.
                    </Paragraph>
                  </TabPane>
                  <TabPane tab="Values" key="3">
                    <Title level={4} style={{ color: '#D7263D' }}>Our Values</Title>
                    <ul style={{ paddingLeft: '20px', fontSize: '16px', lineHeight: '1.8' }}>
                      <li>Integrity</li>
                      <li>Accountability</li>
                      <li>Customer Satisfaction</li>
                      <li>Teamwork</li>
                    </ul>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>

            <Divider />

            {/* Why Choose Us Section */}
            <Row style={{ marginTop: '40px' }}>
              <Col xs={24}>
                <Title level={3} style={{ textAlign: 'center', color: '#D7263D', marginBottom: '40px' }}>
                  Why Choose Us
                </Title>
                <Row gutter={[24, 24]} justify="center">
                  {[
                    {
                      icon: <VerifiedOutlined style={{ fontSize: '40px', color: '#D7263D' }} />,
                      title: 'Quality Products',
                      description: 'We offer only the best electronics from top brands.',
                    },
                    {
                      icon: <DollarOutlined style={{ fontSize: '40px', color: '#D7263D' }} />,
                      title: 'Competitive Prices',
                      description: 'Get the best deals and discounts on top products.',
                    },
                    {
                      icon: <RocketOutlined style={{ fontSize: '40px', color: '#D7263D' }} />,
                      title: 'Fast Shipping',
                      description: 'Quick and reliable delivery to your doorstep.',
                    },
                    {
                      icon: <CustomerServiceOutlined style={{ fontSize: '40px', color: '#D7263D' }} />,
                      title: 'Excellent Support',
                      description: 'Timely customer support to assist with your needs.',
                    },
                  ].map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                      <Card
                        hoverable
                        style={{
                          textAlign: 'center',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {item.icon}
                        <Paragraph strong style={{ margin: '16px 0 8px' }}>{item.title}</Paragraph>
                        <Paragraph style={{ fontSize: '14px', color: '#555' }}>{item.description}</Paragraph>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default About;
