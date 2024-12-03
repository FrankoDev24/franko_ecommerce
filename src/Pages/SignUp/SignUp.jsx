import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { createCustomer } from '../../Redux/slice/customerSlice';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import logo from '../../assets/frankoIcon.png';

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerAccountNumber: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    password: '',
    accountType: 'customer', // default is customer
    email: '', // added email for agents
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accountNumber = uuidv4();
    setFormData((prevState) => ({
      ...prevState,
      customerAccountNumber: accountNumber,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectAccountType = (value) => {
    setFormData({ ...formData, accountType: value });
  };

  const handleSubmit = async (values) => {
    const { accountType, email, contactNumber, ...rest } = values;
  
    // Validate agent email
    if (accountType === 'agent' && !email.endsWith('frankotrading.com')) {
      message.error('Invalid email for agent!');
      return;
    }
  
    // Simulated check for existing contact number (replace with actual database logic)
    const existingContact = false;
    if (existingContact) {
      message.error('Contact number already exists!');
      return;
    }
  
    // Prepare final data for submission
    const finalData = {
      ...rest,
      accountType,
      email: accountType === 'agent' ? email : '',
      ContactNumber: contactNumber,
      customerAccountNumber: formData.customerAccountNumber,
    };
  
    setLoading(true);
    try {
      const result = await dispatch(createCustomer(finalData)).unwrap(); // Attempt to create the customer
      message.success('Registration successful!');
  
      // Navigate based on account type only after success
      if (finalData.accountType === 'agent') {
        navigate('/agent-dashboard');
      } else {
        navigate('/franko');
      }
  
      console.log('Registration result:', result); // Log result for debugging
    } catch (error) {
      message.error('Registration failed: ' + error.message);
      console.error('Registration error:', error); // Detailed error logging
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Form layout="vertical" onFinish={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center">
          <img src={logo} alt="Logo" className="w-32 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        </div>

        <Input
          name="customerAccountNumber"
          value={formData.customerAccountNumber}
          readOnly
          hidden
        />

        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
          <Input 
            prefix={<UserOutlined />} 
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
          <Input 
            prefix={<UserOutlined />} 
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Contact Number" name="contactNumber" rules={[{ required: true, message: 'Please input your contact number!' }]}>
          <Input 
            prefix={<PhoneOutlined />} 
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input 
            type="address" 
            prefix={<HomeOutlined />} 
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password 
            prefix={<LockOutlined />} 
            onChange={handleChange} 
            visibilityToggle
          />
        </Form.Item>

        <Form.Item label="Account Type" name="accountType" rules={[{ required: true, message: 'Please select an account type!' }]}>
          <Select 
            value={formData.accountType}
            onChange={handleSelectAccountType}
          >
            <Select.Option value="customer">Customer</Select.Option>
            <Select.Option value="agent">Agent</Select.Option>
          </Select>
        </Form.Item>

        {formData.accountType === 'agent' && (
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input 
              prefix={<MailOutlined />} 
              onChange={handleChange} 
              placeholder="Email Address"
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button htmlType="submit" block loading={loading} className="bg-green-800 text-white ">
            Register
          </Button>
        </Form.Item>

        <p className="mt-4 text-center">
          Already registered?{' '}
          <span
            onClick={() => navigate('/sign-in')} 
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </Form>
    </div>
  );
};

export default RegistrationPage;
