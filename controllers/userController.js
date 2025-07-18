const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Toggle user status (activate/deactivate)
exports.toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
};

// Edit user (except password)
exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  await user.save();
  res.json({ message: 'User updated', user });
};

// Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
};

// Update own profile (name, profile picture)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;
    let update = {};
    if (name) update.name = name;
    if (req.file) update.profilePicture = req.file.filename;

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Profile update failed' });
  }
};