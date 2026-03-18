const express = require('express');
const router = express.Router();
const { getUserProfileActivity } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/profile
// @desc    Get user's activity
// @access  Private
router.get('/', protect, getUserProfileActivity);

module.exports = router;