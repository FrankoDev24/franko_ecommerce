import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Tooltip, Modal, Input, DatePicker, Empty } from "antd";
import { EyeOutlined,DownloadOutlined, ShoppingCartOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { fetchOrdersByUser } from "../Redux/slice/orderSlice";
import moment from "moment";

const backendBaseURL = "https://smfteapi.salesmate.app";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const customer = JSON.parse(localStorage.getItem("customer"));
  const userId = customer ? customer.customerAccountNumber : null;

  const localStorageOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
  const combinedOrders = orders.length > 0 ? orders : localStorageOrders;

  const [filteredOrders, setFilteredOrders] = useState(combinedOrders);
  const [filter, setFilter] = useState({ date: null, amount: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    applyFilters();
  }, [filter, combinedOrders]);

  const applyFilters = () => {
    let filtered = [...combinedOrders];

    // Filter by date
    if (filter.date) {
      filtered = filtered.filter((order) =>
        moment(order.date).isSame(moment(filter.date), "day")
      );
    }

    // Filter by amount
    if (filter.amount) {
      filtered = filtered.filter((order) =>
        order.totalAmount.toString().includes(filter.amount)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalVisible(false);
  };

  if (loading.orders) {
    return <div className="text-center mt-4">Loading orders...</div>;
  }

  if (error.orders) {
    return <div className="text-center mt-4 text-red-500">Error loading orders: {error.orders}</div>;
  }

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => `#${text.slice(0, 5)}`,
      responsive: ["xs", "sm", "md", "lg"],
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Product",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <div className="flex items-center space-x-2">
         
          <span>{items[0]?.productName || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "items",
      key: "items",
      render: (items) => items.reduce((sum, item) => sum + item.quantity, 0),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = {
          Pending: "orange",
          Cancelled: "red",
          Completed: "green",
        }[status] || "blue";
        return <Tag color={color}>{status}</Tag>;
      },
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Total (₵)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total) => `₵${total.toLocaleString()}`,
      responsive: ["xs", "sm", "md", "lg"],
    },
   
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="View">
            <EyeOutlined
              className="text-blue-500 cursor-pointer"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Download Receipt">
            <DownloadOutlined className="text-green-500 cursor-pointer" />
          </Tooltip>
         
        </div>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div className="order-history p-4">
    <div className="flex items-center space-x-2 mb-5 text-red-500">
  <ShoppingCartOutlined className="text-2xl  md:text-3xl" />
  <h2 className="text-lg font-semibold md:text-2xl ">Order History</h2>
</div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <DatePicker
          onChange={(date) => setFilter({ ...filter, date })}
          placeholder="Filter by Date"
          className="w-full md:w-1/3"
        />
        <Input
          placeholder="Filter by Amount"
          value={filter.amount}
          onChange={(e) => setFilter({ ...filter, amount: e.target.value })}
          className="w-full md:w-1/3"
        />
      </div>

      {/* Responsive Table */}
      {filteredOrders.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderId"
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: 600 }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center mt-10">
          <Empty
            description={<span><strong>No Orders Found</strong></span>}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 200, marginBottom: 2}}
          />
        </div>
      )}

      {/* Modal */}
      <Modal
  title={
    <div className="flex items-center space-x-2">
      <EyeOutlined />
      <span className="text-lg font-semibold">Order Details</span>
    </div>
  }
  visible={isModalVisible}
  onCancel={handleCloseModal}
  footer={null}
  width={500}
  bodyStyle={{ padding: '24px 24px 16px' }}
>
  {selectedOrder && (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg space-y-6">
      {/* Order ID and Status */}
      <div className="flex flex-col  space-y-2 w-full">
        <h3 className="text-xl font-semibold text-gray-800">Order ID: {selectedOrder.orderId}</h3>
        <div className="w-full border-t border-gray-200"></div>
        <p className="text-sm text-gray-500">
          <CalendarOutlined className="inline-block mr-2" />
          <strong>Date:</strong> {moment(selectedOrder.date).format("YYYY-MM-DD")}
        </p>
      </div>

      {/* Separator line */}
      <div className="w-full border-t border-gray-200"></div>

      {/* Order Items */}
      <div className="space-y-4 w-full">
        {selectedOrder.items.map((item) => (
          <div
            key={item.cartId}
            className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            {/* Product Image - Full Left */}
            <div className="flex-shrink-0 w-1/3">
              <img
                src={`${backendBaseURL}/Media/Products_Images/${item.imagePath.split("\\").pop()}`}
                alt={item.productName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Item Details - Aligned to the Right */}
            <div className="flex-1 pl-4">
              <h4 className="font-medium text-gray-800">{item.productName}</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Price:</strong> ₵{item.price.toLocaleString()}</p>
                <p><strong>Qty:</strong> {item.quantity}</p>
                <p><strong>Total:</strong> ₵{item.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Separator line */}
      <div className="w-full border-t border-gray-200"></div>

      {/* Additional Order Information */}
      <div className="w-full text-center">
       
        <p className="text-sm text-red-500">
          <DollarOutlined className="inline-block mr-2" />
          <strong>Total Amount:</strong> ₵{selectedOrder.totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  )}
</Modal>



    </div>
  );
};

export default OrderHistory;
