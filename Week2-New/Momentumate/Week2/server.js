const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const Task = require('./models/Task');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();              // app setup
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error:', err));

const cors = require('cors');
app.use(cors()); 

// app.use(authMiddleware)

app.post('/tasks', authMiddleware, async (req, res) => {            //CRUD Create route
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/upload', authMiddleware, upload.single('file'), (req, res) => {          // File uploading
  res.status(200).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
  });
});

app.get('/tasks', authMiddleware, async (req, res) => {          //CRUD Read route
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tasks/:id', authMiddleware, async (req, res) => {        // Get single course
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', authMiddleware, async (req, res) => {           //CRUD Update route
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/tasks/:id', authMiddleware , async (req, res) => {       //CRUD Delete route
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
});

app.put('/tasks/:id/enroll', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
       return res.status(404).json({ error: 'Course not found' });

    const alreadyEnrolled = task.enrolledBy.some((id) => id.toString() === req.userId);
    if (!alreadyEnrolled) {
      task.enrolledBy.push(req.userId);
      await task.save();
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/tasks/:id/lectures', authMiddleware, async (req, res) => {    // add a resource link to a course
  try {
    const { title, link } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Course not found' });

    task.lectures.push({ title, link, completedBy: [] });
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/tasks/:id/toggle-lecture', authMiddleware, async (req, res) => {   // mark/unmark a lecture as completed
  try {
    const { lectureIndex } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Course not found' });

    const lecture = task.lectures[lectureIndex];
    if (!lecture) return res.status(404).json({ error: 'Lecture not found' });

    const doneIndex = lecture.completedBy.findIndex((uid) => uid.toString() === req.userId);
    if (doneIndex === -1) {
      lecture.completedBy.push(req.userId);
    } else {
      lecture.completedBy.splice(doneIndex, 1);
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/signup', async (req, res) => {         // signup route
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

app.post('/login', async (req, res) => {          // login route
  try {
    const { username, password } = req.body;

    // 1. Finding User
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Password matching (hash to hash)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/forgot-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {          // error handling
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});