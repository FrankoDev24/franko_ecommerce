import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderTransition } from "../../Redux/slice/orderSlice"; // Assuming you have this action

const UpdateOrderCycleModal = ({ isVisible, onClose, orderCode, fetchOrders }) => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const [orderCycle, setOrderCycle] = useState("");

  const order = orders.find((order) => order.orderCode === orderCode);

  useEffect(() => {
    if (order) {
      setOrderCycle(order.orderCycle);
    }
  }, [order, orderCode]);

  const handleStatusChange = (value) => {
    setOrderCycle(value);
  };

  // Function to update the order cycle
  const handleUpdateOrderCycle = async () => {
    console.log("OrderCode:", orderCode);  // Ensure this is not undefined
    console.log("OrderCycle:", orderCycle); // Ensure this is not undefined
  
    if (!orderCode || !orderCycle) {
      message.error("Order cycle or order code is missing");
      return;
    }
  
    try {
      const response = await dispatch(updateOrderTransition({ CycleName: orderCycle, OrderId: orderCode }));
      if (response.payload?.responseCode === "1") {
        message.success("Order cycle updated successfully");
        fetchOrders(); // Re-fetch orders to reflect the update
        onClose(); // Close the modal
      } else {
        message.error("Failed to update order cycle");
      }
    } catch (error) {
      message.error("Error updating order cycle");
    }
  };
  

  return (
    <Modal
      title="Update Order Status"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="update" type="primary" onClick={handleUpdateOrderCycle}>Update</Button>, // Use handleUpdateOrderCycle here
      ]}
    >
      <Select value={orderCycle} onChange={handleStatusChange} style={{ width: "100%" }}>
        <Select.Option value="Processing">Processing</Select.Option>
        <Select.Option value="Confirmed">Confirmed</Select.Option>
        <Select.Option value="Pending">Pending</Select.Option>
        <Select.Option value="Unreachable">Unreachable</Select.Option>
        <Select.Option value="Wrong Number">Wrong Number</Select.Option>
        <Select.Option value="Cancelled">Cancelled</Select.Option>
        <Select.Option value="Not Answered">Not Answered</Select.Option>
        <Select.Option value="Delivery">Delivery</Select.Option>
        <Select.Option value="Completed">Completed</Select.Option>
      </Select>
    </Modal>
  );
};

export default UpdateOrderCycleModal;
