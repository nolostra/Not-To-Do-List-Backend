const express = require('express');
const router = express.Router();
const { authenticateUser, checkUserRole } = require('../middleware');
const Task = require('../models/Task');

// Get all tasks
router.get('/tasks', authenticateUser, async (req, res) => {
  // Implement logic to get all tasks
  try {
    // Implement logic to get all tasks
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new task
router.post('/tasks', authenticateUser, checkUserRole('HRAdmin'), async (req, res) => {
  // Implement logic to add a new task
  try {
    // Validate required fields in the request body
    const { title, description, priority, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required fields.' });
    }

    // Validate priority against enum values
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value.' });
    }

    // Validate dueDate format (optional)
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: 'Invalid dueDate format.' });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      priority: priority || 'medium', // Use default if not provided
      dueDate: dueDate ? new Date(dueDate) : undefined, // Convert to Date object if provided
    });

    // Save the task to MongoDB
    await newTask.save();

    res.status(201).json({
        "message":"data saved"
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a task
router.put('/tasks/:taskId', authenticateUser, checkUserRole('HRAdmin'), async (req, res) => {
  // Implement logic to update a task
  const { taskId } = req.params;
  const { title, description, priority, dueDate } = req.body;

  try {
    // Validate required fields in the request body
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required fields.' });
    }

    // Validate priority against enum values
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value.' });
    }

    // Validate dueDate format (optional)
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: 'Invalid dueDate format.' });
    }

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task fields
    task.title = title;
    task.description = description;
    task.priority = priority || 'medium'; // Use default if not provided
    task.dueDate = dueDate ? new Date(dueDate) : undefined; // Convert to Date object if provided

    // Save the updated task to MongoDB
    await task.save();

    res.json({
        "message":`Task Updated`
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a task
router.delete('/tasks/:taskId', authenticateUser, checkUserRole('HRAdmin'),async (req, res) => {
  // Implement logic to delete a task
  const { taskId } = req.params;

  try {
    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
        "message":`Task Deleted`
    });
  } catch (error) {
    console.error('Error deleting task by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
