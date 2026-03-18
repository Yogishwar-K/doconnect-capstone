const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getQuestions,
    getQuestionById,
    createAnswer,
    addComment,
    toggleLike,
    voteQuestion,
    deleteComment
} = require('../controllers/questionController');

const { protect } = require('../middleware/authMiddleware');

// Question Routes (require user login)
router.route('/')
    .post(protect, createQuestion)
    .get(getQuestions);

router.route('/:id')
    .get(getQuestionById);

// Answer Route
router.route('/:id/answers')
    .post(protect, createAnswer);

// Interaction Routes (Comments & Likes)
router.route('/answers/:id/comments')
    .post(protect, addComment);

router.route('/answers/:id/like')
    .post(protect, toggleLike);

// Voting Route for Questions
router.post('/:id/vote', protect, voteQuestion);

// Comment Deletion Route
router.delete('/answers/comments/:commentId', protect, deleteComment);

module.exports = router;