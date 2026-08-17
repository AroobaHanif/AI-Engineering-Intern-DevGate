import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, placeOrder } from '../features/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const { items, orderNumber } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleOrder = () => {
    dispatch(placeOrder());
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (orderNumber) {
    return (
      <div className="book-container">
        <div className="book-order-banner">
          ✅ Order Completed! Your order number is <strong>#{orderNumber}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="book-container">
      <h1 className="book-title">Your Cart</h1>
      {items.length === 0 ? (
        <p className="book-subtitle">Cart is empty.</p>
      ) : (
        <>
          <div className="book-grid">
            {items.map((item) => (
              <div className="book-item" key={item._id}>
                <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="price">${item.price}</p>
                <div className="book-item-actions">
                  <button onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <h2>${total}</h2>
              <p>Total</p>
            </div>
          </div>
          <button onClick={handleOrder} style={{ marginTop: '1.5rem' }}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;