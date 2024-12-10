import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../Redux/slice/customerSlice";
import { Table, Spin, Alert, Input } from "antd";

const { Search } = Input;

const Customers = () => {
  const dispatch = useDispatch();
  const { customerList, loading, error } = useSelector((state) => state.customer);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchCustomers()); // Fetch customers on component mount
  }, [dispatch]);

  useEffect(() => {
    if (customerList) {
      setFilteredData(customerList);
    }
  }, [customerList]);

  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();
    const filtered = customerList.filter((customer) =>
      customer.firstName.toLowerCase().includes(lowercasedValue) ||
      customer.address.toLowerCase().includes(lowercasedValue) ||
      customer.contactNumber.toLowerCase().includes(lowercasedValue) ||
      customer.accountType.toLowerCase().includes(lowercasedValue)
    );
    setFilteredData(filtered);
  };

  // Ant Design Table Columns Configuration
  const columns = [
    {
      title: "Account Number",
      dataIndex: "customerAccountNumber",
      key: "customerAccountNumber",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
    },
  ];

  if (loading) {
    return <Spin size="large" className="spinner" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4 text-red-500">Customers</h1>
      <Search
        placeholder="Search by first name, address, contact number, or account type"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        value={searchText}
        style={{ marginBottom: "20px", maxWidth: "500px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => record.customerAccountNumber}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Customers;
