const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthService = require('../../Application/services/AuthService');
const UserRepository = require('../../Infrastructure/repositories/UserRepository');

const router = express.Router();

// Initialize dependencies
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.getCurrentUser);

module.exports = router;
