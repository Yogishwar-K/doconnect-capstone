const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getAllUsers, checkEmailExists, forgotPassword, resetPassword } = require('../controllers/authController');
const { updateUserProfile } = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/check-email', checkEmailExists);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, getAllUsers); 

module.exports = router;