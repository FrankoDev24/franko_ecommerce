import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../Redux/slice/customerSlice';
import { Table, Spin, Alert } from 'antd';

const Customers = () => {
  const dispatch = useDispatch();
  const { customerList, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(fetchCustomers()); // Fetch customers on component mount
  }, [dispatch]);

  // Ant Design Table Columns Configuration
  const columns = [
    {
      title: 'Account Number',
      dataIndex: 'customerAccountNumber',
      key: 'customerAccountNumber',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      key: 'accountType',
    },
  ];

  if (loading) {
    return <Spin size="large" className="spinner" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="text-2xl font-bold mb-4 text-red-500">Customers</h1>
      <Table
        columns={columns}
        dataSource={customerList}
        rowKey={(record) => record.customerAccountNumber}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Customers;
