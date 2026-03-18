const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Chat Routes (Require user to be logged in to send/read messages)
router.route('/:receiverId')
    .post(protect, sendMessage);

router.route('/:userId')
    .get(protect, getChatHistory);

module.exports = router;