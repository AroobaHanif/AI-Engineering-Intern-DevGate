import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import API from '../api/axios';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../features/productSlice';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const [stats, setStats] = useState({ totalUsers: 0, completedOrders: 0 });
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', stock: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    API.get('/admin/stats').then((res) => setStats(res.data));
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateProduct({ id: editId, data: form }));
      setEditId(null);
    } else {
      dispatch(addProduct(form));
    }
    setForm({ name: '', description: '', price: '', image: '', stock: '' });
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    setEditId(product._id);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div className="book-container">
      <h1 className="book-title">Admin Dashboard</h1>

      <div className="stats-row">
        <div className="stat-card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h2>{stats.completedOrders}</h2>
          <p>Completed Orders</p>
        </div>
      </div>

      <div className="book-card" style={{ marginTop: '2rem', maxWidth: '500px' }}>
        <h3 className="book-title" style={{ fontSize: '1.2rem' }}>
          {editId ? 'Edit Product' : 'Add Product'}
        </h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <button type="submit">{editId ? 'Update Product' : 'Add Product'}</button>
        </form>
      </div>

      <div className="book-grid" style={{ marginTop: '2rem' }}>
        {items.map((product) => (
          <div className="book-item" key={product._id}>
            <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p>Stock: {product.stock}</p>
            <div className="book-item-actions">
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;