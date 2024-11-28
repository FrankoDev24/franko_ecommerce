import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByCustomer, fetchSalesOrderById } from "../Redux/slice/orderSlice";
import { DatePicker, Table, Spin, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading = {}, error = {}, salesOrder = [] } = useSelector((state) => state.orders || {});

  const today = moment();
  const defaultFromDate = moment("01/01/2000", "MM/DD/YYYY");
  const defaultToDate = today.clone().add(1, "days");

  const [dateRange, setDateRange] = useState([defaultFromDate, defaultToDate]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const customerObject = JSON.parse(localStorage.getItem("customer"));
  const customerId = customerObject?.customerAccountNumber;

  useEffect(() => {
    if (customerId) {
      const [from, to] = dateRange.map((date) => date.format("MM/DD/YYYY"));
      dispatch(fetchOrdersByCustomer({ from, to, customerId }));
    }
  }, [dateRange, customerId, dispatch]);

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleViewOrder = (orderId) => {
    dispatch(fetchSalesOrderById(orderId));
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { 
      title: "Order ID", 
      dataIndex: "orderId", 
      key: "orderId",
      render: (orderId) => orderId.slice(-6), // Show last 6 digits of Order ID
    },
    { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
    { title: "Order Status", dataIndex: "orderCycle", key: "orderCycle" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <EyeOutlined
          className="text-green-700 text-xl cursor-pointer"
          onClick={() => handleViewOrder(record.orderId)}
        />
      ),
    },
  ];
  const transformedOrders = orders
  .map((order, index) => ({
    key: index,
    orderId: order?.orderCode || "N/A",
    orderDate: moment(order?.orderDate).format("MM/DD/YYYY") || "N/A",
    customerName: order?.fullName || "N/A",
    orderCycle: order?.orderCycle || "N/A",
  }))
  .sort((a, b) => moment(b.orderDate).isBefore(moment(a.orderDate)) ? 1 : -1);  // Sorting by orderDate from newest to oldest

  const salesOrderTotal = (salesOrder || []).reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  return (
    <div className="order-history-page container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-red-500">Order History</h2>
      <div className="mb-4">
        <label className="text-md">Select Date Range: </label>
        <DatePicker.RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="MM/DD/YYYY"
          className="mt-2"
        />
      </div>

      {loading.orders ? (
        <Spin size="large" />
      ) : error.orders ? (
        <p className="text-red-500">Error: {error.orders}</p>
      ) : (
        <Table
          dataSource={transformedOrders}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title={`Order: ${salesOrder[0]?.orderCode || "Details"}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        className="w-full sm:w-4/5 md:w-3/5 lg:w-1/2"
      >
        {loading.salesOrder ? (
          <Spin size="large" />
        ) : error.salesOrder ? (
          <p className="text-red-500">Error: {error.salesOrder}</p>
        ) : salesOrder.length > 0 ? (
          <div>
            {salesOrder.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-2 border-b last:border-none"
              >
                <img
                  src={`https://smfteapi.salesmate.app/Media/Products_Images/${item.imagePath?.split("\\").pop()}`}
                  alt={item.productName || "Product"}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <p className="text-sm">{item.productName || "N/A"}</p>
         
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold">
                    {new Intl.NumberFormat("en-GH", {
                      style: "currency",
                      currency: "GHS",
                    }).format(item.price || 0)}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity || 0}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 ">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>
                  {new Intl.NumberFormat("en-GH", {
                    style: "currency",
                    currency: "GHS",
                  }).format(salesOrderTotal || 0)}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping</p>
                <p>{new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(0)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg  border-t" >
                <p>Total</p>
                <p className="text-red-500">
                  {new Intl.NumberFormat("en-GH", {
                    style: "currency",
                    currency: "GHS",
                  }).format((salesOrderTotal || 0) + 0)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>No order details available.</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
