const express = require('express');
const WishlistController = require('../controllers/WishlistController');
const WishlistService = require('../../Application/services/WishlistService');
const WishlistRepository = require('../../Infrastructure/repositories/WishlistRepository');
const UserRepository = require('../../Infrastructure/repositories/UserRepository');
const authMiddleware = require('../../Domain/middleware/authMiddleware');

const router = express.Router();

// Initialize dependencies
const wishlistRepository = new WishlistRepository();
const userRepository = new UserRepository();
const wishlistService = new WishlistService(wishlistRepository, userRepository);
const wishlistController = new WishlistController(wishlistService);

// Routes (auth removed for testing)
// router.use(authMiddleware);

router.post('/', wishlistController.addToWishlist);
router.get('/user/:userId', wishlistController.getUserWishlist);
router.delete('/user/:userId/clear', wishlistController.clearWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);

module.exports = router;
