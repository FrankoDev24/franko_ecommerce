import {
    Layout,
    Row,
    Col,
    Card,
    Typography,
    Form,
    Input,
    Button,
    Table,
    notification,
    Tooltip,
  } from "antd";
  import {
    PhoneOutlined,
    MailOutlined,
    FacebookOutlined,
    InstagramOutlined,
    XOutlined,
  } from "@ant-design/icons";
  import { FaTiktok, FaWhatsapp } from "react-icons/fa";
  import emailjs from "@emailjs/browser";
  import "./Contact.css";
  import { Helmet } from "react-helmet";
  
  const { Content } = Layout;
  const { Title, Paragraph } = Typography;
  
  const Contact = () => {
    const locations = [
      {
        title: "ADABRAKA",
        address: "OPPOSITE ROXY BUS STOP ADABRAKA - ACCRA",
        tel: "0264189099",
        lat: 5.558,
        lng: -0.2057,
      },
      {
        title: "ACCRA",
        address: "UTC NEAR DESPITE BUILDING",
        tel: "0561925889",
        lat: 5.552,
        lng: -0.2022,
      },
      {
        title: "CIRCLE",
        address: "NEAR ODO RICE BUILDING",
        tel: "0302250396",
        lat: 5.5599,
        lng: -0.2076,
      },
      {
        title: "CIRCLE",
        address: "OPPOSITE ODO RICE BUILDING",
        tel: "0261506861",
        lat: 5.559,
        lng: -0.207,
      },
      {
        title: "CIRCLE",
        address: "ADJACENT ODO RICE BUILDING",
        tel: "0509842053",
        lat: 5.5591,
        lng: -0.2069,
      },
      {
        title: "OSU",
        address: "OXFORD STREET BEHIND VODAFONE OFFICE",
        tel: "0302772103",
        lat: 5.557,
        lng: -0.182,
      },
      {
        title: "TEMA",
        address: "COMMUNITY 1 STADIUM ROAD OPPOSITE WATER WORKS",
        tel: "0303214499",
        lat: 5.678,
        lng: -0.0166,
      },
      {
        title: "MADINA",
        address: "MADINA OLD ROAD AROUND ABSA BANK, REPUBLIC BANK",
        tel: "0241184688",
        lat: 5.683,
        lng: -0.1654,
      },
      {
        title: "HAATSO",
        address: "HAATSO STATION/BEIGE CAPITAL BUILDING, OPPOSITE MTN",
        tel: "0243628837",
        lat: 5.653,
        lng: -0.213,
      },
      {
        title: "LAPAZ",
        address: "NII BOI JUNCTION OPPOSITE PRUDENTIAL BANK",
        tel: "0561944202",
        lat: 5.607,
        lng: -0.235,
      },
      {
        title: "KASOA",
        address: "OPPOSITE POLYCLINIC",
        tel: "0264084686",
        lat: 5.534,
        lng: -0.4244,
      },
      {
        title: "KOFORIDUA",
        address: "ALL NATION UNIVERSITY TOWERS, PRINCE BOATENG AROUND ABOUT",
        tel: "0268313323",
        lat: 6.09,
        lng: -0.259,
      },
      {
        title: "KUMASI",
        address: "OPPOSITE HOTEL DE KINGSWAY",
        tel: "0322041018",
        lat: 6.692,
        lng: -1.618,
      },
      {
        title: "KUMASI",
        address: "ASEDA HOUSE OPPOSITE CHALLENGE BOOKSHOP",
        tel: "0322081949",
        lat: 6.688,
        lng: -1.622,
      },
      {
        title: "KUMASI",
        address: "ADJACENT MELCOM ADUM",
        tel: "0322047303",
        lat: 6.693,
        lng: -1.619,
      },
      {
        title: "KUMASI",
        address: "NEAR BARCLAYS BANK",
        tel: "0206310483",
        lat: 6.691,
        lng: -1.6225,
      },
      {
        title: "KUMASI",
        address: "NEAR KUFFOUR CLINIC",
        tel: "0501538602",
        lat: 6.694,
        lng: -1.621,
      },
      {
        title: "KUMASI",
        address: "OPPOSITE KEJETIA",
        tel: "0501525698",
        lat: 6.69,
        lng: -1.623,
      },
      {
        title: "HO",
        address: "OPPOSITE AMEGASHI (GOD IS GREAT BUILDING)",
        tel: "0362025775",
        lat: 6.612,
        lng: 0.47,
      },
      {
        title: "HO ANNEX",
        address: "NEAR THE HO MAIN STATION",
        tel: "0501647165",
        lat: 6.6125,
        lng: 0.4695,
      },
      {
        title: "SUNYANI",
        address: "OPPOSITE COCOA BOARD",
        tel: "0202765836",
        lat: 7.34,
        lng: -2.326,
      },
      {
        title: "TECHIMAN",
        address: "TECHIMAN TAXI RANK NEAR REPUBLIC BANK",
        tel: "0352522426",
        lat: 7.583,
        lng: -1.939,
      },
      {
        title: "BEREKUM",
        address: "BEREKUM ROUNDABOUT OPPOSITE SG-SSB BANK",
        tel: "0209835344",
        lat: 7.456,
        lng: -2.586,
      },
      {
        title: "CAPE COAST",
        address: "LONDON BRIDGE OPPOSITE OLD GUINNESS DEPOT",
        tel: "0264212339",
        lat: 5.106,
        lng: -1.246,
      },
      {
        title: "TAKORADI",
        address: "CAPE COAST STATION NEAR SUPER STAR HOTEL",
        tel: "0249902589",
        lat: 4.889,
        lng: -1.755,
      },
      {
        title: "TARKWA",
        address: "TARKWA STATION NEAR THE SHELL FILLING STATION",
        tel: "0312320144",
        lat: 5.312,
        lng: -1.995,
      },
      {
        title: "TAMALE",
        address: "OLD SALAGA STATION NEAR PK",
        tel: "0265462241",
        lat: 9.407,
        lng: -0.853,
      },
      {
        title: "HOHOE",
        address: "JAHLEX STORE NEAR THE TRAFFIC LIGHT",
        tel: "0558106241",
        lat: 7.15,
        lng: 0.473,
      },
      {
        title: "WA",
        address: "ZONGO OPPOSITE MAMA'S KITCHEN",
        tel: "0261915228",
        lat: 10.06,
        lng: -2.501,
      },
      {
        title: "WA",
        address: "WA MAIN STATION",
        tel: "0507316718",
        lat: 10.0605,
        lng: -2.5005,
      },
      {
        title: "BOLGA",
        address: "COMMERCIAL STREET NEAR ACCESS BANK",
        tel: "0501538603",
        lat: 10.787,
        lng: -0.851,
      },
      {
        title: "OBUASI",
        address: "CENTRAL MOSQUE-OPPOSITE ADANSI RURAL BANK",
        tel: "0263535131",
        lat: 6.204,
        lng: -1.666,
      },
      {
        title: "SWEDRU",
        address: "OPPOSITE MELCOM",
        tel: "0557872937",
        lat: 5.532,
        lng: -0.682,
      },
      {
        title: "ASHIAMAN",
        address: "OPPOSITE MAIN LORRY STATION",
        tel: "0509570736",
        lat: 5.688,
        lng: -0.04,
      },
      {
        title: "CIRCLE SERVICE CENTER",
        address: "NEAR ODO RICE",
        tel: "0501575745",
        lat: 5.5597,
        lng: -0.208,
      },
      {
        title: "KUMASI SERVICE CENTER",
        address: "ADUM BEHIND THE OLD MELCOM BUILDING",
        tel: "0322033821",
        lat: 6.693,
        lng: -1.619,
      },
      {
        title: "TAMALE SERVICE CENTER",
        address: "ADJACENT QUALITY FIRST SHOPPING CENTER",
        tel: "0501505020",
        lat: 9.411,
        lng: -0.856,
      },
      {
        title: "TOGO",
        address: "",
        tel: "+228 92 01 97 45",
        lat: 6.137,
        lng: 1.212,
      },
    ];
  
    const columns = [
      {
        title: "Shop Name",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (text, record) => (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${record.lat},${record.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" ,color:"inherit"}}
          >
            {text}
          </a>
        ),
      },
      {
        title: "Telephone",
        dataIndex: "tel",
        key: "tel",
        render: (text) => (
          <a href={`tel:${text}`} style={{ textDecoration: "none" ,color:"inherit"}}>{text}</a>
        ),
      },
    ];
    
  
    const handleFormSubmit = (values) => {
      emailjs
        .send("service_1rrjoml", "template_ypg8soa", values, "YOUR_USER_ID")
        .then((_response) => {
          console.log(_response);
          notification.success({
            message: "Message Sent",
            description: "Your message has been sent successfully!",
          });
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Message Failed",
            description:
              "There was an error sending your message. Please try again later.",
          });
        });
    };
  
    return (
      <Layout>
         <Helmet>
        <title>Contact Franko Trading Enterprise</title>
        <meta name="description" content="Contact Franko Trading Enterprise for inquiries, support, and more. Reach out via phone or social media." />
        <meta name="keywords" content="contact, Franko Trading, Accra, Ghana, support, inquiries, social media" />
        <meta property="og:title" content="Contact Franko Trading Enterprise" />
        <meta property="og:description" content="Contact Franko Trading Enterprise for inquiries, support, and more. Reach out via phone or social media." />
        <meta property="og:image" content="URL-to-image.jpg" />
        <meta property="og:url" content="https://www.frankotrading.com/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Franko Trading Enterprise" />
        <meta name="twitter:description" content="Contact Franko Trading Enterprise for inquiries, support, and more. Reach out via phone or social media." />
        <meta name="twitter:image" content="URL-to-image.jpg" />
      </Helmet>
        <Content style={{ padding: "0 30px" }}>
          <div className="site-layout-content">
            <h3 style={{ fontSize: "20px", color: "#D7263D", fontWeight: "bold", marginBottom: "20px" }}>Contact Us</h3>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} md={8}>
                <Card className="contact-card">
                  <PhoneOutlined style={{ fontSize: "24px", color: "#f5222d" }} />
                  <Title level={4}>Call Us</Title>
                  <Paragraph>We are available 6 days a week.</Paragraph>
                  <a href="tel:+233246422338" style={{ textDecoration: "none" ,color:"inherit"}}>0246422338</a>
                  <Title level={4} style={{ textAlign: "center", marginTop:"20px" }}>
                    Follow Us
                  </Title>
                  <div className="social-icons">
                    <Tooltip title="Facebook">
                      <a
                        href="https://web.facebook.com/frankotradingenterprise"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FacebookOutlined
                          style={{
                            fontSize: "24px",
                            color: "#3b5998",
                            
                          }}
                        />
                      </a>
                    </Tooltip>
                    <Tooltip title="Instagram">
                      <a
                        href="https://www.instagram.com/frankotradingenterprise"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramOutlined
                          style={{
                            fontSize: "24px",
                            color: "#E1306C",
                            
                          }}
                        />
                      </a>
                    </Tooltip>
                    <Tooltip title="X">
                      <a
                        href="https://x.com/frankotrading1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <XOutlined
                          style={{
                            fontSize: "24px",
                            color: "#000000",
                            
                          }}
                        />
                      </a>
                    </Tooltip>
                    <Tooltip title="TikTok">
                      <a
                        href="https://www.tiktok.com/@frankotrading"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTiktok
                          style={{
                            fontSize: "24px",
                            color: "#000000",
                            marginTop:"-10px"
                          
                          }}
                        />
                      </a>
                    </Tooltip>
                    <Tooltip title="WhatsApp">
                      <a
                        href="https://wa.me/0555939311"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp
                          style={{
                            fontSize: "24px",
                            color: "#25D366",
                             marginTop:"-10px"
                          }}
                        />
                      </a>
                    </Tooltip>
                  </div>
                </Card>
                <Card className="contact-card">
                  <MailOutlined style={{ fontSize: "24px", color: "#f5222d" }} />
                  <Title level={4}>Write To Us</Title>
                  <Paragraph>
                    Fill out our form and we will contact you within 24 hours.
                  </Paragraph>
                  <a href="mailto:online@frankotrading.com" style={{ textDecoration: "none" , color:"inherit"}}>
                    online@frankotrading.com
                  </a>
                </Card>
              </Col>
              <Col xs={24} md={16}>
                <Form layout="vertical" onFinish={handleFormSubmit}>
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          { required: true, message: "Please enter your name" },
                        ]}
                      >
                        <Input placeholder="Your Name *" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Please enter your email" },
                        ]}
                      >
                        <Input placeholder="Your Email *" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your phone number",
                          },
                        ]}
                      >
                        <Input placeholder="Your Phone *" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[
                      { required: true, message: "Please enter your message" },
                    ]}
                  >
                    <Input.TextArea rows={6} placeholder="Your Message" />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: "green", borderColor: "green" }}
                  >
                    Send Message
                  </Button>
                </Form>
              </Col>
            </Row>
            <h3 style={{ fontSize: "20px", color: "#D7263D", fontWeight: "bold"}}>Our Locations</h3>
            <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
              <Col xs={24}>
                <Table
                  columns={columns}
                  dataSource={locations}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 'max-content' }}
                />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    );
  };
  
  export default Contact;