import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { loginCustomer } from '../../Redux/slice/customerSlice';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/frankoIcon.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    contactNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (values) => {
    setLoading(true); // Set loading to true
    try {
      await dispatch(loginCustomer(values)).unwrap();
      message.success('Login successful!');
      navigate('/franko');
    } catch (error) {
      message.error(error || 'Login failed.');
      navigate('/sign-up');
    } finally {
      setLoading(false); // Reset loading to false
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex flex-col items-center justify-center">
          <img src={logo} alt="Logo" className="w-32 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        </div>

        <Form.Item
          label="Contact Number"
          name="contactNumber"
          rules={[{ required: true, message: 'Please enter your contact number!' }]}
        >
          <Input
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            htmlType="submit" 
            block 
            className="bg-green-800 text-white" 
            loading={loading} // Bind the loading state
          >
            Login
          </Button>
        </Form.Item>

        <p className="mt-4 text-center">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/sign-up')}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </Form>
    </div>
  );
};

export default LoginPage;
