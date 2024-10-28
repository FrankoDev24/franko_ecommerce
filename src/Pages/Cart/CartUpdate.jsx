import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { updateCartItem } from '../../Redux/slice/cartSlice';

const CartUpdatePage = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
  const [quantity, setQuantity] = useState(item.quantity);

  const handleUpdate = () => {
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    const transactionNumber = localStorage.getItem('transactionNumber');
    if (!transactionNumber) {
      alert("Transaction number not found in local storage. Please try again.");
      return;
    }

    const params = {
      cartId: transactionNumber,
      productId: item.productId,
      quantity: quantity,
    };

    dispatch(updateCartItem(params))
      .unwrap()
      .then(() => {
        alert("Cart item updated successfully!");
        navigate('/cart'); // Redirect to Cart page after successful update
      })
      .catch((error) => {
        alert("Failed to update cart item: " + error);
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-0">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Update Cart Item
        </h2>
        <div className="flex flex-col gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Cart ID:</p>
            <p className="text-gray-800">{localStorage.getItem('transactionNumber')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Product Name:</p>
            <p className="text-gray-800">{item.productName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Product ID:</p>
            <p className="text-gray-800">{item.productId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Current Quantity:</p>
            <p className="text-gray-800">{item.quantity}</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="quantity" className="text-sm font-semibold text-gray-600">
              Update Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-20 p-2 border border-gray-300 rounded-lg text-gray-700"
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 mt-6">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartUpdatePage;
