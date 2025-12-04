const express = require('express');
const UserController = require('../controllers/UserController');
const UserService = require('../../Application/services/UserService');
const UserRepository = require('../../Infrastructure/repositories/UserRepository');
const authMiddleware = require('../../Domain/middleware/authMiddleware');

const router = express.Router();

// Initialize dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes (all protected)
router.use(authMiddleware);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
