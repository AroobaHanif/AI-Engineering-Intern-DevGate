import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchGenres, fetchFavorites, toggleFavorite } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import toast from 'react-hot-toast';

function Products() {
  const dispatch = useDispatch();
  const { items, favorites, genres } = useSelector((state) => state.products);
  const [activeGenre, setActiveGenre] = useState('All');
  const [query, setQuery] = useState('');
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchGenres());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const isFavorite = (id) => favorites.some((f) => f._id === id);

  const handleFavorite = (id) => {
    dispatch(toggleFavorite({ id, isFav: isFavorite(id) }));
    toast.success(isFavorite(id) ? '💔 Removed from favorites' : '❤️ Added to favorites');
  };

  const handleAddToCart = (id) => {
    dispatch(addToCart(id));
    setAddedId(id);
    toast.success('✅ Added to cart!');
    setTimeout(() => setAddedId(null), 1200);
  };

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchesGenre = activeGenre === 'All' || p.genre === activeGenre;
      const matchesQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.author || '').toLowerCase().includes(query.toLowerCase());
      return matchesGenre && matchesQuery;
    });
  }, [items, activeGenre, query]);

  return (
    <div className="book-container">
      <h1 className="book-title">📖 Browse the Shelf</h1>
      <p className="book-subtitle">Every genre, one shelf away.</p>

      <input
        type="text"
        placeholder="Search by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <div className="genre-filter-row">
        <button
          className={activeGenre === 'All' ? 'genre-chip active' : 'genre-chip'}
          onClick={() => setActiveGenre('All')}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            className={activeGenre === g ? 'genre-chip active' : 'genre-chip'}
            onClick={() => setActiveGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="book-subtitle" style={{ marginTop: '2rem' }}>
          No books found. Try a different genre or search term.
        </p>
      ) : (
        <div className="book-grid">
          {filtered.map((product) => (
            <div className="book-item" key={product._id}>
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=260&fit=crop'} 
                alt={product.name} 
              />
              <span className="genre-badge">{product.genre}</span>
              <h3>{product.name}</h3>
              <p className="author">by {product.author}</p>
              {product.description && (
                <p className="description">{product.description.substring(0, 60)}...</p>
              )}
              {/* ✅ Price in Dollars */}
              <p className="price">${product.price}</p>
              <p className="stock">📦 {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
              <div className="book-item-actions">
                <button onClick={() => handleAddToCart(product._id)}>
                  {addedId === product._id ? '✅ Added' : '🛒 Add to Cart'}
                </button>
                <button
                  className={isFavorite(product._id) ? 'fav-active' : ''}
                  onClick={() => handleFavorite(product._id)}
                >
                  {isFavorite(product._id) ? '❤️ Saved' : '♡ Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;