import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, toggleFavorite } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';

function Favorites() {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(toggleFavorite({ id, isFav: true }));
  };

  const handleAddToCart = (id) => {
    dispatch(addToCart(id));
  };

  return (
    <div className="book-container">
      <h1 className="book-title">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="book-subtitle">No favorites yet.</p>
      ) : (
        <div className="book-grid">
          {favorites.map((product) => (
            <div className="book-item" key={product._id}>
              <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <div className="book-item-actions">
                <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                <button className="fav-active" onClick={() => handleRemove(product._id)}>
                  ♥ Remove
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