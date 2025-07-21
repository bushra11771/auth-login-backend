const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const Todo = require('../models/Todo');
const User = require('../models/User');
const EmailService = require('../email/authEmail');

// Helper function to build query
const buildTodoQuery = (userId, filters) => {
  const { search, completed } = filters;
  const query = { user: userId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (completed !== undefined) {
    query.completed = completed === 'true';
  }

  return query;
};

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const dir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const query = buildTodoQuery(req.userId, req.query);
    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const userId = req.userId; // Use userId from middleware
    
    // Handle file upload if exists
    const imageUrl = req.file ? req.file.path : null;

    const newTodo = await Todo.create({
      title,
      description,
      dueDate,
      imageUrl,
      user: userId // Use 'user' field as per model
    });

    // Fetch user details for email
    const user = await User.findById(userId);
    
    if (user && user.email) {
      try {
        await EmailService.sendNewTodoEmail(
          user.email,
          {
            title: newTodo.title,
            description: newTodo.description,
            dueDate: newTodo.dueDate,
            imageUrl: newTodo.imageUrl ? `${req.protocol}://${req.get('host')}/${newTodo.imageUrl}` : null
          },
          user.name || 'User'
        );
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }
    }

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    ensureUploadsDir();
    const { id } = req.params;
    const { title, description, completed, dueDate, removeImage } = req.body;

    const existingTodo = await Todo.findOne({ _id: id, user: req.userId });
    if (!existingTodo) {
      if (req.file) await unlinkAsync(req.file.path);
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updateData = {
      title,
      description,
      completed,
      dueDate
    };

    // Handle image updates
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      // Delete old image if exists
      if (existingTodo.imageUrl) {
        const oldImagePath = path.join(__dirname, '../public', existingTodo.imageUrl);
        if (fs.existsSync(oldImagePath)) await unlinkAsync(oldImagePath);
      }
    } else if (removeImage === 'true') {
      updateData.imageUrl = null;
      // Delete old image if exists
      if (existingTodo.imageUrl) {
        const oldImagePath = path.join(__dirname, '../public', existingTodo.imageUrl);
        if (fs.existsSync(oldImagePath)) await unlinkAsync(oldImagePath);
      }
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    if (req.file) await unlinkAsync(req.file.path);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Delete associated image if exists
    if (todo.imageUrl) {
      const imagePath = path.join(__dirname, '../public', todo.imageUrl);
      if (fs.existsSync(imagePath)) await unlinkAsync(imagePath);
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};