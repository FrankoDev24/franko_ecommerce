import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Redux/slice/userSlice"; // Adjust path as necessary
import { Table, Spin, Alert, Input } from "antd";

const { Search } = Input;

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user || { users: [], loading: false, error: null });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercasedValue) ||
        user.contact.toLowerCase().includes(lowercasedValue) ||
        user.position.toLowerCase().includes(lowercasedValue)
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "uuserid",
      key: "uuserid",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Users</h1>
      <Search
        placeholder="Search by name, contact number, or position"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        value={searchText}
        style={{ marginBottom: "20px", maxWidth: "500px" }}
      />
      {loading && <Spin size="large" />}
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      <Table
        dataSource={filteredUsers}
        columns={columns}
        bordered
        rowKey="uuserid"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Users;
