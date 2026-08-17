import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, completedOrders: 0 });
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const statsRes = await API.get('/admin/stats');
    setStats(statsRes.data);
    const productsRes = await API.get('/products');
    setProducts(productsRes.data);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setName(''); setAuthor(''); setGenre('Fiction'); setPrice(''); setStock(''); setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Price Validation - Must be > 0 and max 2 decimal places
    const priceNum = Number(price);
    if (priceNum <= 0) {
      toast.error('❌ Price must be greater than 0!');
      return;
    }
    if (priceNum > 99999) {
      toast.error('❌ Price is too high (max 99999)!');
      return;
    }
    // Check for max 2 decimal places (e.g., 12.99 is valid, 12.999 is invalid)
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      toast.error('❌ Price must have at most 2 decimal places (e.g., 12.99)');
      return;
    }
    
    // ✅ Stock Validation - Must be >= 0
    const stockNum = Number(stock);
    if (stockNum < 0) {
      toast.error('❌ Stock cannot be negative!');
      return;
    }
    if (!Number.isInteger(stockNum)) {
      toast.error('❌ Stock must be a whole number!');
      return;
    }
    
    const data = { 
      name, 
      author, 
      genre, 
      price: priceNum, 
      stock: stockNum 
    };
    
    try {
      if (editId) {
        await API.put(`/products/${editId}`, data);
        toast.success('📚 Product updated');
      } else {
        await API.post('/products', data);
        toast.success('📚 Product added');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setName(p.name); 
    setAuthor(p.author); 
    setGenre(p.genre); 
    setPrice(p.price); 
    setStock(p.stock);
  };

  const handleDelete = async (id) => {
    if (window.confirm('🗑️ Delete this book?')) {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      load();
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <span className="admin-subtitle">Manage your bookstore</span>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-number">{stats.completedOrders}</div>
          <div className="stat-label">Completed Orders</div>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Books Listed</div>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="admin-form-wrapper">
        <h3 className="admin-form-title">{editId ? '✏️ Edit Book' : '📖 Add New Book'}</h3>
        <form onSubmit={handleSubmit} className="admin-form-grid">
          <input 
            placeholder="📕 Title" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            placeholder="✍️ Author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required 
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {['Fiction','Non-Fiction','Fantasy','Mystery & Thriller','Romance','Sci-Fi','Horror','Biography','Self-Help','History','Poetry',"Children's"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input 
            placeholder="💲 Price (e.g., 12.99)" 
            type="number" 
            min="0.01"
            step="0.01"
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
          <input 
            placeholder="📦 Stock (whole number)" 
            type="number" 
            min="0"
            step="1"
            value={stock} 
            onChange={(e) => setStock(e.target.value)} 
            required 
          />
          <div className="admin-form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-save">
              {editId ? '📝 Update' : '➕ Add'}
            </button>
            {editId && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Books Grid */}
      <h3 className="admin-section-title">📚 All Books ({products.length})</h3>
      {products.length === 0 ? (
        <p className="admin-empty">No books yet — add your first one above!</p>
      ) : (
        <div className="admin-books-grid">
          {products.map((p) => (
            <div className="admin-book-card" key={p._id}>
              <img 
                className="book-image"
                src={p.image || 'https://placehold.co/200x260?text=No+Cover'} 
                alt={p.name} 
              />
              <span className="book-genre">{p.genre}</span>
              <h4 className="book-title">{p.name}</h4>
              <p className="book-author">by {p.author}</p>
              <p className="book-price">${Number(p.price).toFixed(2)}</p>
              <p className={`book-stock ${p.stock <= 0 ? 'out-of-stock' : ''}`}>
                {p.stock > 0 ? `📦 ${p.stock} in stock` : '❌ Out of stock'}
              </p>
              <div className="book-actions">
                <button className="btn-edit" onClick={() => handleEdit(p)}>✏️ Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;