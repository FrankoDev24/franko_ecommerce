import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';
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
    confirmPassword: '',
    imagePath: '',
    accountType: '',
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

  const handleSubmit = async (values) => {
    const { accountType, ...rest } = values;
    const finalData = {
      ...rest,
      accountType,
      imagePath: formData.imagePath,
      customerAccountNumber: formData.customerAccountNumber,
    };
  
    setLoading(true);
    try {
      const result = await dispatch(createCustomer(finalData)).unwrap();
      message.success('Registration successful!');
      
      // Extract contact number and password from the form data
      const { contactNumber, password } = finalData;
  
      // Navigate to login page with contact number and password as URL parameters
      navigate("/sign-in", { state: { contactNumber, password } });
      console.log('Registration result:', result); // Log the entire result
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
        <div className="flex flex-col items-center justify-center"> {/* Centering container */}
          <img src={logo} alt="Logo" className="w-32 mb-4" /> {/* Logo */}
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2> {/* Centered heading */}
        </div>

          <Input
            name="customerAccountNumber"
            value={formData.customerAccountNumber} // Ensure the account number is displayed
            readOnly // Make account number read-only
            hidden
          />
       

        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
          <Input 
            prefix={<UserOutlined />} // Add user icon
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
          <Input 
            prefix={<UserOutlined />} // Add user icon
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Contact Number" name="contactNumber" rules={[{ required: true, message: 'Please input your contact number!' }]}>
          <Input 
            prefix={<PhoneOutlined />} // Add phone icon
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input 
            type="address" 
            prefix={<HomeOutlined />} // Add address icon
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password 
            prefix={<LockOutlined />} // Add lock icon
            onChange={handleChange} 
            visibilityToggle
          />
        </Form.Item>

        <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
          <Input.Password 
            prefix={<LockOutlined />} // Add lock icon
            onChange={handleChange} 
            visibilityToggle
          />
        </Form.Item>

     <Form.Item>
          <Button htmlType="submit" block loading={loading} className="bg-green-800 text-white ">
            Register
          </Button>
        </Form.Item>
        <p className="mt-4 text-center">
          Already registered?{' '}
          <span
            onClick={() => navigate('/sign-in')} // Use navigate instead of history
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
