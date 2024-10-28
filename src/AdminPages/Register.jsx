import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { registerUser } from '../Redux/slice/userSlice'; // Adjust path based on your file structure
import { useNavigate, Link } from 'react-router-dom'; // Added Link for navigation

const UserRegistration = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const onFinish = (values) => {
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    // Automatically generate the user ID
    const newUser = {
      ...values,
      uuserid: uuidv4(), // Generate a unique user ID using uuid
    };

    // Dispatch the registration action
    dispatch(registerUser(newUser))
      .unwrap()
      .then(() => {
        message.success('User registered successfully!');
        form.resetFields();
        navigate('/admin/login'); // Navigate to login page upon success
      })
      .catch((error) => {
        message.error(`Registration failed: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.error(errorInfo);
    message.error('Please fill in all required fields!');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:px-8 bg-white shadow-lg rounded-lg mt-20">
      {/* Logo */}
      <div className="text-center mb-8">
        <img src="/path-to-logo/logo.png" alt="Logo" className="mx-auto h-16 w-16" /> {/* Adjust the path */}
      </div>

      {/* Registration Form */}
      <h2 className="text-3xl font-bold text-center mb-6">User Registration</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="space-y-4"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input className="w-full p-2 border rounded-md" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input className="w-full p-2 border rounded-md" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            
          ]}
        >
          <Input.Password className="w-full p-2 border rounded-md" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your password!' }]}
        >
          <Input.Password className="w-full p-2 border rounded-md" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input className="w-full p-2 border rounded-md" />
        </Form.Item>

        <Form.Item
          label="Contact"
          name="contact"
          rules={[{ required: true, message: 'Please input your contact number!' }]}
        >
          <Input className="w-full p-2 border rounded-md" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Register
          </Button>
        </Form.Item>
      </Form>

      {/* Already Registered? Login Link */}
      <div className="text-center mt-4">
        <p>
          Already registered?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegistration;
