// routes/todoRoutes.js

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const verifyToken = require('../Middlewares/Auth'); // assuming Auth exports verifyToken

// Protect all routes with verifyToken middleware
router.use(verifyToken);

// CRUD routes
router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
