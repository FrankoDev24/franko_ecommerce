import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Redux/slice/userSlice'; // Adjust path as necessary
import { Table, Spin, Alert } from 'antd';

const Users = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.user || { users: [], loading: false, error: null });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    console.log(users); // Debugging log to check data structure

    const columns = [
        {
            title: 'ID',
            dataIndex: 'uuserid', // Ensure this matches the key in your data
            key: 'uuserid',
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        }
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Users</h1>
            {loading && <Spin size="large" />}
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            <Table
                dataSource={users}
                columns={columns}
                bordered
                rowKey="uuserid" // Use the unique identifier here
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default Users;
