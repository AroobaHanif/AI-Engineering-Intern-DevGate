const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { authMiddleware, adminOnly } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// ===== AUTH ROUTES =====

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== PRODUCT ROUTES =====

// Get all products (public - koi bhi dekh sakta hai)
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add product (admin only)
app.post('/products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    const newProduct = new Product({ name, description, price, image, stock });
    await newProduct.save();
    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update product (admin only)
app.put('/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete product (admin only)
app.delete('/products/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ADMIN STATS ROUTE =====


app.get('/admin/stats', authMiddleware, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        res.status(200).json({ totalUsers, completedOrders});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== CART ROUTES =====

app.post('/cart/add/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.cart.includes(req.params.productId)) {
      user.cart.push(req.params.productId);
      await user.save();
    }
    res.status(200).json({ message: 'Added to cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cart/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.status(200).json({ message: 'Removed from cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cart', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart');
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== FAVORITES ROUTES =====

app.post('/favorites/add/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(req.params.productId)) {
      user.favorites.push(req.params.productId);
      await user.save();
    }
    res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/favorites/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ORDER ROUTES =====

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

    res.status(201).json({ message: 'Order completed', orderNumber: newOrder.orderNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
// ===== START SERVER =====

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});