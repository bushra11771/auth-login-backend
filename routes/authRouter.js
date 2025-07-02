const { model } = require('mongoose');
const { signup, login } = require('../controllers/authController');

const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router(); 

// router.post('/login', async (req, res) => {
//     res.send('Login successful');
// });
router.post('/signUp', signupValidation, signup)
router.post('/login', loginValidation, login)


module.exports = router;