import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { loginCustomer } from '../../Redux/slice/customerSlice'; // Adjust the import based on your file structure
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import logo from "../../assets/frankoIcon.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [formData, setFormData] = useState({
    Contact_number: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(loginCustomer(values)).unwrap(); // Use values directly from the onFinish
      message.success('Login successful!');
      navigate('/'); // Navigate to home page upon successful login
    } catch (error) {
      message.error('Login failed: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
     
      <Form layout="vertical" onFinish={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center"> {/* Centering container */}
          <img src={logo} alt="Logo" className="w-32 mb-4" /> {/* Logo */}
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2> {/* Centered heading */}
        </div>
        <Form.Item label="Contact Number" required>
          <Input
            name="Contact_number"
            value={formData.Contact_number}
            onChange={handleChange}
            required
          />
        </Form.Item>

        <Form.Item label="Password" required>
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Item>

        <Form.Item>
          <Button  htmlType="submit" block className="bg-green-800 text-white ">
            Login
          </Button>
        </Form.Item>
        <p className="mt-4 text-center">
        Don’t have an account?{' '}
        <span
          onClick={() => navigate('/sign-up')} // Correct usage of navigate
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
