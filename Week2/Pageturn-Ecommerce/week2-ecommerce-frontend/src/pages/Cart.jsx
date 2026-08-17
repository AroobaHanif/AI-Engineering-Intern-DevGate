import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart, updateCartQuantity, decreaseCartItem, clearCart, placeOrder, resetOrder } from '../features/cartSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Cart() {
  const dispatch = useDispatch();
  const { items, orderNumber } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch, token]);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('🗑️ Removed from cart');
  };

  const handleIncrease = (id) => {
    dispatch(updateCartQuantity(id));
    toast.success('✅ Quantity updated');
  };

  const handleDecrease = (id) => {
    dispatch(decreaseCartItem(id));
  };

// Group duplicate items, show quantity count
  const groupedItems = Object.values(
    items.reduce((acc, item) => {
    if (acc[item._id]) acc[item._id].quantity += 1;
    else acc[item._id] = { ...item, quantity: 1 };
    return acc;
  }, {})
);

  const handleClearCart = () => {
    if (window.confirm('Clear entire cart?')) {
      dispatch(clearCart());
      toast.success('🧹 Cart cleared');
    }
  };

  const handleOrder = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    try {
      await dispatch(placeOrder()).unwrap();
      toast.success('🎉 Order placed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    }
  };

  //  Total in Dollars
  const total = groupedItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  
  if (!token) {
    return (
      <div className="book-container">
        <div className="book-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 className="book-title">Please Login</h2>
          <p className="book-subtitle">You need to be logged in to view your cart.</p>
          <Link to="/login" className="book-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="book-container">
        <div className="book-order-banner">
          🎉 Order Completed! <br />
          Your order number is <strong>#{orderNumber}</strong>
          <br /><br />
          <Link to="/" className="book-link" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-container">
      <h1 className="book-title">🛒 Your Cart</h1>
      {items.length === 0 ? (
        <p className="book-subtitle">Cart is empty. Start browsing books!</p>
      ) : (
        <>
          <div className="book-grid">
            {groupedItems.map((item, index) => (
              <div className="book-item" key={item._id || index}>
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop'} 
                  alt={item.name} 
                />
                <span className="genre-badge">{item.genre}</span>
                <h3>{item.name}</h3>
                <p className="author">by {item.author}</p>
                {/* Price in Dollars */}
                <p className="price">${item.price}</p>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.5rem 0' }}>
                  <button 
                    onClick={() => handleIncrease(item._id)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      background: '#6b4226',
                      color: '#fdf6e9',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ➕
                  </button>
                  <span style={{ fontSize: '0.9rem' }}>Qty: {item.quantity || 1}</span>
                  <button 
                    onClick={() => handleDecrease(item._id)}
                    style={{
                      padding: '0.3rem 0.8rem',
                      background: '#c0392b',
                      color: '#fdf6e9',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ➖
                  </button>
                </div>
                
                <div className="book-item-actions">
                  <button onClick={() => handleRemove(item._id)}>🗑️ Remove</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="stats-row">
            <div className="stat-card" style={{ flex: 'none' }}>
              {/* Total in Dollars */}
              <h2>${total}</h2>
              <p>Total</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleOrder} 
              style={{
                padding: '0.8rem 2rem',
                background: '#6b4226',
                color: '#fdf6e9',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Lora, serif',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#543319';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#6b4226';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📦 Place Order
            </button>
            
            <button 
              onClick={handleClearCart}
              style={{
                padding: '0.8rem 2rem',
                background: '#c0392b',
                color: '#fdf6e9',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Lora, serif',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#922B21';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#c0392b';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🧹 Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;