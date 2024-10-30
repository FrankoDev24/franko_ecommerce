import {  useState } from "react";
import { Modal, Button, InputNumber, Spin, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem } from "../../Redux/slice/cartSlice";

// UpdateCartModal.js
const UpdateCartModal = ({ visible, onClose, productId, currentQuantity, onUpdate }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const [quantity, setQuantity] = useState(currentQuantity);

  const handleUpdate = () => {
    const cartId = localStorage.getItem("transactionNumber");

    if (cartId && quantity > 0) {
      dispatch(updateCartItem({ cartId, productId, quantity })).then(() => {
        onUpdate(); // Call onUpdate to refresh the cart items
        onClose(); // Close the modal after updating
      });
    }
  };

  return (
    <Modal
      title="Update Cart Item"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate} disabled={loading}>
          Update
        </Button>
      ]}
    >
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}
          <div>
            <p>Current Quantity: {currentQuantity}</p>
            <InputNumber
              min={1}
              value={quantity}
              onChange={(value) => setQuantity(value)}
              className="w-full"
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default UpdateCartModal;

