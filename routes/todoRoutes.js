const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const upload = require('../Middlewares/upload');
const auth = require('../Middlewares/auth');

router.get('/', auth, todoController.getTodos);
router.post('/', auth, upload.single('image'), todoController.createTodo);
router.put('/:id', auth, upload.single('image'), todoController.updateTodo);
router.delete('/:id', auth, todoController.deleteTodo);

module.exports = router;