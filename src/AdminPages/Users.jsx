// UsersPage.js
import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Redux/slice/userSlice'; // Adjust path as necessary
import { Table, Spin, Alert } from 'antd';

const Users = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.user || { users: [], loading: false, error: null });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const columns = [
      
        {
            title: 'ID',
            dataIndex: 'uuserid', // Adjust based on your API response
            key: 'uuserid',
        },
        {
            title: 'Name',
            dataIndex: 'fullName', // Adjust based on your API response
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email', // Adjust based on your API response
            key: 'email',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contact', // Adjust based on your API response
            key: 'contact',
        },
        {
            title: 'Address',
            dataIndex: 'address', // Adjust based on your API response
            key: 'address',
        },
        // Add more columns as needed
    ];

    return (
        <div>
            {loading && <Spin size="large" />}
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id" // Adjust if the unique identifier is different
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default Users;
