const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const upload = require('../Middlewares/upload');
const { auth, superAdmin } = require('../Middlewares/Auth');

router.get('/', todoController.getTodos);
router.put('/:id', auth, upload.single('image'), todoController.updateTodo);
router.delete('/:id', auth, todoController.deleteTodo);
router.get('/all', auth, superAdmin, todoController.getAllTodosWithUser);

module.exports = router;