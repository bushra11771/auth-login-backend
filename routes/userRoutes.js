const express = require('express');
const router = express.Router();
const { auth, superAdmin } = require('../Middlewares/Auth');
const userController = require('../controllers/userController');
const upload = require('../Middlewares/upload'); 


// Get all users (already for superadmin)
router.get('/',auth, superAdmin, userController.getAllUsers);

// Deactivate/Activate user
router.patch('/:id/status', auth, superAdmin, userController.toggleUserStatus);

// Edit user
router.put('/:id', auth, superAdmin, userController.updateUser);

// Delete user
router.delete('/:id', auth, superAdmin, userController.deleteUser);

router.put('/profile', auth, upload.single('profilePicture'), userController.updateProfile);


module.exports = router;