import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchFavorites, toggleFavorite } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';

function Products() {
  const dispatch = useDispatch();
  const { items, favorites } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const isFavorite = (id) => favorites.some((f) => f._id === id);

  const handleFavorite = (id) => {
    dispatch(toggleFavorite({ id, isFav: isFavorite(id) }));
  };

  const handleAddToCart = (id) => {
    dispatch(addToCart(id));
  };

  return (
    <div className="book-container">
      <h1 className="book-title">Browse Products</h1>
      <div className="book-grid">
        {items.map((product) => (
          <div className="book-item" key={product._id}>
            <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <div className="book-item-actions">
              <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
              <button
                className={isFavorite(product._id) ? 'fav-active' : ''}
                onClick={() => handleFavorite(product._id)}
              >
                {isFavorite(product._id) ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;