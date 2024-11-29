import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Select, Spin, message } from 'antd';
import { PhoneOutlined, MailOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchShippingCountries,
  fetchShippingDivisions,
  fetchShippingLocations,
} from '../Redux/slice/shippingSlice';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const { countries, divisions, locations, loading } = useSelector((state) => state.shipping);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [shippingDetails, setShippingDetails] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page load

    const userData = JSON.parse(localStorage.getItem('customer')) || {};
    setUser(userData);

    dispatch(fetchShippingCountries());

    const savedShippingDetails = JSON.parse(localStorage.getItem('shippingDetails'));
    if (savedShippingDetails) {
      setShippingDetails(savedShippingDetails);
      setSelectedCountry(savedShippingDetails.country || '');
      setSelectedDivision(savedShippingDetails.division || '');
      setSelectedLocation(savedShippingDetails.location || '');
    }
  }, [dispatch]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedDivision('');
    setSelectedLocation('');
    dispatch(fetchShippingDivisions(value));
  };

  const handleDivisionChange = (value) => {
    setSelectedDivision(value);
    setSelectedLocation('');
    dispatch(fetchShippingLocations(value));
  };

  const handleSaveShippingDetails = () => {
    const selectedLocationDetails = locations.find((location) => location.locationCode === selectedLocation);
    const selectedDivisionDetails = divisions.find((division) => division.divisionCode === selectedDivision);

    const details = {
      country: selectedCountry,
      division: selectedDivisionDetails?.divisionName || '',
      location: selectedLocationDetails?.locationName || '',
      locationCharge: selectedLocationDetails?.shippingCharge || 0,
    };
    setShippingDetails(details);
    localStorage.setItem('shippingDetails', JSON.stringify(details));
    message.success('Shipping details saved successfully!');
  };

  const getContactNumber = () =>
    user.contactNumber || user.ContactNumber || 'Not Provided';

  if (!user) {
    return <Spin tip="Loading User Information..." />;
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="center" gutter={[16, 16]}>
        {/* Customer Details */}
        <Col xs={24} sm={22} md={10}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={user.imagePath || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Title level={3} style={{ marginTop: '10px', color: '#333' }}>
                {user.firstName} {user.lastName}
              </Title>
              <strong>Account Number:</strong> {user.customerAccountNumber || 'N/A'}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Paragraph>
                <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <strong>Email:</strong> {user.email || 'N/A'}
              </Paragraph>
              <Paragraph>
                <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                <strong>Phone:</strong> {getContactNumber()}
              </Paragraph>
              <Paragraph>
                <HomeOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <strong>Address:</strong> {user.address || 'N/A'}
              </Paragraph>
            </div>
          </Card>
        </Col>

        {/* Shipping Details */}
        <Col xs={24} sm={22} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <Title level={4} style={{ marginBottom: '20px', color: '#333' }}>
              Shipping Information
            </Title>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Select Country
              </label>
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="Select a Country"
                style={{ width: '100%' }}
                loading={loading}
              >
                {countries.map((country) => (
                  <Option key={country.countryCode} value={country.countryCode}>
                    {country.countryName}
                  </Option>
                ))}
              </Select>
            </div>
            {selectedCountry && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Select Region
                </label>
                <Select
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  placeholder="Select a Division"
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  {divisions.map((division) => (
                    <Option key={division.divisionCode} value={division.divisionCode}>
                      {division.divisionName}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
            {selectedDivision && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Select Town
                </label>
                <Select
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Select a Location"
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  {locations.map((location) => (
                    <Option key={location.locationCode} value={location.locationCode}>
                      {location.locationName}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
            <Button
              type="primary"
              onClick={handleSaveShippingDetails}
              style={{
                width: '100%',
                backgroundColor: '#3F6634',
                borderColor: '#3F6634',
                marginTop: '20px',
              }}
            >
              Save Shipping Details
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
