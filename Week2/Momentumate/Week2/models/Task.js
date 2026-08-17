const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  lectures: [lectureSchema],
  enrolledBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);