import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, toggleFavorite } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function Favorites() {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, token]);

  const handleRemove = (id) => {
    dispatch(toggleFavorite({ id, isFav: true }));
    toast.success('Removed from favorites');
  };

  const handleAddToCart = (id) => {
    dispatch(addToCart(id));
    toast.success('Added to cart!');
  };

  if (!token) {
    return (
      <div className="book-container">
        <div className="book-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 className="book-title">Please Login</h2>
          <p className="book-subtitle">You need to be logged in to view your favorites.</p>
          <Link to="/login" className="book-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-container">
      <h1 className="book-title">❤️ Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="book-subtitle">No favorites yet. Start saving books you love!</p>
      ) : (
        <div className="book-grid">
          {favorites.map((product) => (
            <div className="book-item" key={product._id}>
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop'} 
                alt={product.name} 
              />
              <span className="genre-badge">{product.genre}</span>
              <h3>{product.name}</h3>
              <p className="author">by {product.author}</p>
              <p className="price">${product.price}</p>
              <div className="book-item-actions">
                <button onClick={() => handleAddToCart(product._id)}>🛒 Add to Cart</button>
                <button className="fav-active" onClick={() => handleRemove(product._id)}>
                  ❤️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;