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
  },
//   tags: {
//     type: [String],
//     default: [],
//     validate: {
//       validator: function(tags) {
//         return tags.every(tag => tag.length <= 20);
//       },
//       message: 'Each tag must be 20 characters or less'
//     }
//   },
//   category: {
//     type: String,
//     trim: true,
//     maxlength: 30
//   },
  dueDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return date === null || date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
TodoSchema.index({ user: 1, completed: 1 });
TodoSchema.index({ user: 1, dueDate: 1 });
// TodoSchema.index({ user: 1, category: 1 });
// TodoSchema.index({ user: 1, tags: 1 });

module.exports = mongoose.model('Todo', TodoSchema);