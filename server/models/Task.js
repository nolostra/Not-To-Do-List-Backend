const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
