const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    toggleUserStatus,
    approveQuestion,
    approveAnswer,
    resolveQuestion,
    deleteQuestion,
    deleteAnswer,
    getPendingQuestions,
    getPendingAnswers
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');

// every route in this file requires a valid token + admin role
router.use(protect, admin);

router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);

router.get('/questions/pending', getPendingQuestions);
router.put('/questions/:id/approve', approveQuestion);
router.put('/questions/:id/resolve', resolveQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/answers/pending', getPendingAnswers);
router.put('/answers/:id/approve', approveAnswer);
router.delete('/answers/:id', deleteAnswer);

module.exports = router;