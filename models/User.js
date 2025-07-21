const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
   role: {
    type: String,
    enum: ['superadmin', 'admin', 'provider', 'customer'],
    default: 'superadmin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
createdAt: {
  type: Date,
  default: Date.now
},
profilePicture: {
  type: String,
  default: null
}
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', UserSchema); 