import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkOutOrder } from '../../Redux/slice/orderSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const orders = useSelector((state) => state.order.orders);
  const status = useSelector((state) => state.order.status);
  const error = useSelector((state) => state.order.error);

  useEffect(() => {
    // Trigger checkout process
    const cartId = localStorage.getItem('transactionNumber');
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const customerAccountNumber = user.customerAccountNumber;

    if (cartId && customerAccountNumber) {
      dispatch(checkOutOrder({ cartId, customerId: customerAccountNumber }));
    }
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Checkout Successful</h2>
      {orders.map(order => (
        <div key={order.id}>{JSON.stringify(order)}</div>
      ))}
      {/* Button to navigate to Order Lifecycle page */}
      <button onClick={() => navigate('/order-lifecycle')}>View Order Lifecycle</button>
    </div>
  );
};

export default Checkout;
