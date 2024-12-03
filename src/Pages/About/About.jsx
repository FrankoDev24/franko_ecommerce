import { Layout, Row, Col, Typography, Card, Divider, Tabs } from 'antd';
import { DollarOutlined, RocketOutlined, CustomerServiceOutlined, VerifiedOutlined } from '@ant-design/icons';
import franko from "../../assets/franko_office.png";
import franco from "../../assets/franko_office2.png";
import { useEffect } from 'react';

const About = () => {
  const { Content } = Layout;
  const { Title, Paragraph } = Typography;
  const { TabPane } = Tabs;

  // Scroll to top when the page is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <title>Franko | About</title>
      <meta
        name="description"
        content="Franko Trading | Your trusted online store for quality gadgets, phones, laptops, and accessories."
      />
      <Layout>
        <Content className="py-8 px-4">
          <div className="max-w-screen-xl mx-auto">
            {/* About Section */}
            <Row gutter={[32, 32]} className="mt-10 items-center">
              <Col xs={24} md={14}>
                <Title level={2} className="text-red-600">About Us</Title>
                <Paragraph className="text-lg leading-7">
                  Franko Trading Limited is the leading retail and wholesale company of mobile phones, computers,
                  laptops, televisions, and accessories. Established in 2004, we are committed to bringing the latest
                  technological gadgets to Ghana at affordable prices. Our head office is located at Adabraka Opposite Roxy Cinema in Accra.
                </Paragraph>
                <Paragraph className="text-lg leading-7">
                  Known as "Phone Papa Fie" (Home of Quality Phones), we ensure quality and affordability for every Ghanaian.
                </Paragraph>
              </Col>
              <Col xs={24} md={10}>
                <img
                  src={franko}
                  alt="Franko Trading Store"
                  className="w-full rounded-lg shadow-md"
                />
              </Col>
            </Row>

            {/* Tabs Section */}
            <Row gutter={[32, 32]} className="mt-10">
              <Col xs={24} md={10}>
                <img
                  src={franco}
                  alt="Franko Office"
                  className="w-full rounded-lg shadow-md"
                />
              </Col>
              <Col xs={24} md={14}>
                <Tabs defaultActiveKey="1" type="line" centered>
                  <TabPane tab="Vision" key="1">
                    <Title level={4} className="text-red-600">Our Vision</Title>
                    <Paragraph>
                      To devote our human and technological resources to create superior household electronics and
                      mobile phone markets through research and innovation in Ghana and the West African Sub-region.
                    </Paragraph>
                  </TabPane>
                  <TabPane tab="Mission" key="2">
                    <Title level={4} className="text-red-600">Our Mission</Title>
                    <Paragraph>
                      To be the leader in inspiring Africa and the world with innovative products and designs,
                      revolutionizing the electronics and mobile phone market.
                    </Paragraph>
                  </TabPane>
                  <TabPane tab="Values" key="3">
                    <Title level={4} className="text-red-600">Our Values</Title>
                    <ul className="pl-5 text-lg leading-7">
                      <li>Integrity</li>
                      <li>Accountability</li>
                      <li>Customer Satisfaction</li>
                      <li>Teamwork</li>
                    </ul>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>

            <Divider className="my-10" />

            {/* Why Choose Us Section */}
            <Row className="mt-10">
              <Col xs={24}>
                <Title level={3} className="text-center text-red-600 mb-10">
                  Why Choose Us
                </Title>
                <Row gutter={[24, 24]} justify="center">
                  {[
                    {
                      icon: <VerifiedOutlined className="text-red-600 text-4xl" />,
                      title: 'Quality Products',
                      description: 'We offer only the best electronics from top brands.',
                    },
                    {
                      icon: <DollarOutlined className="text-green-600 text-4xl" />,
                      title: 'Competitive Prices',
                      description: 'Get the best deals and discounts on top products.',
                    },
                    {
                      icon: <RocketOutlined className="text-green-600 text-4xl" />,
                      title: 'Fast Shipping',
                      description: 'Quick and reliable delivery to your doorstep.',
                    },
                    {
                      icon: <CustomerServiceOutlined className="text-green-600 text-4xl" />,
                      title: 'Excellent Support',
                      description: 'Timely customer support to assist with your needs.',
                    },
                  ].map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                      <Card
                        hoverable
                        className="text-center rounded-lg shadow-md p-6"
                      >
                        {item.icon}
                        <Paragraph strong className="mt-4 text-xl">{item.title}</Paragraph>
                        <Paragraph className="text-gray-600">{item.description}</Paragraph>
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
