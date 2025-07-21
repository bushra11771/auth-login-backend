const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  completed: {
    type: Boolean,
    default: false
  }
  ,imageUrl: {
    type: String
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
  dueDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return date === null || date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

TodoSchema.index({ user: 1, completed: 1 });
TodoSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Todo', TodoSchema);