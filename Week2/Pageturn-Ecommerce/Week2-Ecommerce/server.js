const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware, adminOnly } = require('./middleware/auth');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// ===== AUTH ROUTES =====

// SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if fields are empty
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Please fill in all fields' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[\w.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Please enter a valid email address' 
      });
    }
    
    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'This email is already registered. Please login instead.' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      password: hashedPassword,
      role: 'user'  // Default role is 'user'
    });
    await newUser.save();
    
    res.status(201).json({ 
      message: 'Account created successfully! Please login.' 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
});

// LOGIN 
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if fields are empty
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Please fill in all fields' 
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ 
        error: 'No account found with this email. Please sign up first.' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Incorrect password. Please try again.' 
      });
    }
    
    // Generate token with role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({ 
      message: 'Login successful!', 
      token,
      role: user.role,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
});

// UPDATE PASSWORD
app.put('/update-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== PRODUCT ROUTES =====

// GET all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET genres
app.get('/genres', (req, res) => {
  res.status(200).json(Product.GENRES);
});

// ADMIN: Create product
app.post('/products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADMIN: Update product
app.put('/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADMIN: Delete product
app.delete('/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Dashboard stats
app.get('/admin/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    res.status(200).json({ totalUsers, completedOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== CART ROUTES =====

// GET cart
app.get('/cart', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart');
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD to cart
app.post('/cart/add/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.cart.includes(req.params.productId)) {
      user.cart.push(req.params.productId);
      await user.save();
    }
    const updatedUser = await User.findById(req.userId).populate('cart');
    res.status(200).json({ message: 'Added to cart', cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE from cart
app.delete('/cart/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(id => id.toString() !== req.params.productId);
    await user.save();
    const updatedUser = await User.findById(req.userId).populate('cart');
    res.status(200).json({ message: 'Removed from cart', cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CLEAR cart
app.delete('/cart/clear', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = [];
    await user.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE cart quantity
app.put('/cart/update/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart.push(req.params.productId);
    await user.save();
    const updatedUser = await User.findById(req.userId).populate('cart');
    res.status(200).json({ message: 'Quantity updated', cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DECREASE quantity by 1 (remove ONE instance only)
app.put('/cart/decrease/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const idx = user.cart.findIndex(id => id.toString() === req.params.productId);
    if (idx !== -1) user.cart.splice(idx, 1);
    await user.save();
    const updatedUser = await User.findById(req.userId).populate('cart');
    res.status(200).json({ message: 'Quantity decreased', cart: updatedUser.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== FAVORITES ROUTES =====

// GET favorites
app.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD to favorites
app.post('/favorites/add/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(req.params.productId)) {
      user.favorites.push(req.params.productId);
      await user.save();
    }
    const updatedUser = await User.findById(req.userId).populate('favorites');
    res.status(200).json({ message: 'Added to favorites', favorites: updatedUser.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE from favorites
app.delete('/favorites/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
    await user.save();
    const updatedUser = await User.findById(req.userId).populate('favorites');
    res.status(200).json({ message: 'Removed from favorites', favorites: updatedUser.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ORDER ROUTES =====
// PLACE order
app.post('/order', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1001;

    const newOrder = new Order({
      userId: req.userId,
      products: user.cart,
      orderNumber: newOrderNumber,
      status: 'completed'
    });
    await newOrder.save();

    user.cart = [];
    await user.save();

    res.status(201).json({ 
      message: 'Order completed', 
      orderNumber: newOrder.orderNumber 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user orders
app.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('products');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== START SERVER =====

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});