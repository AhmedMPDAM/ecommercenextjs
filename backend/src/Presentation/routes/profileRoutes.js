const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const ProfileService = require('../../Application/services/ProfileService');
const ProfileRepository = require('../../Infrastructure/repositories/ProfileRepository');
const UserRepository = require('../../Infrastructure/repositories/UserRepository');
const authMiddleware = require('../../Domain/middleware/authMiddleware');

const router = express.Router();

// Initialize dependencies
const profileRepository = new ProfileRepository();
const userRepository = new UserRepository();
const profileService = new ProfileService(profileRepository, userRepository);
const profileController = new ProfileController(profileService);

// Routes (all protected)
router.use(authMiddleware);

router.get('/user/:userId', profileController.getProfile);
router.post('/', profileController.createProfile);
router.put('/:userId', profileController.updateProfile);
router.delete('/:userId', profileController.deleteProfile);

module.exports = router;
