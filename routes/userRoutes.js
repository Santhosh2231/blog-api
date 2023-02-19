const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes
router.use(authenticate);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;
