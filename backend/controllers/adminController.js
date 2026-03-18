const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// needed for cascading deletes
const { Comment, Like } = require('../models/Interactions'); 

// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/admin/users/:id/status
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isActive = req.body.isActive; 
            const updatedUser = await user.save();
            res.json({ message: `User status changed. isActive: ${updatedUser.isActive}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/admin/questions/:id/approve
const approveQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question) {
            question.isApproved = true;
            await question.save();
            res.json({ message: 'Question approved successfully' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/admin/answers/:id/approve
const approveAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (answer) {
            answer.isApproved = true;
            await answer.save();
            res.json({ message: 'Answer approved successfully' });
        } else {
            res.status(404).json({ message: 'Answer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   PUT /api/admin/questions/:id/resolve
const resolveQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question) {
            question.status = 'resolved';
            await question.save();
            res.json({ message: 'Question thread marked as resolved and closed' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/admin/questions/:id
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // delete everything tied to this question so nothing is left orphaned
        const answers = await Answer.find({ questionId: question._id });
        const answerIds = answers.map(ans => ans._id);

        await Comment.deleteMany({ answerId: { $in: answerIds } });
        await Like.deleteMany({ answerId: { $in: answerIds } });
        await Answer.deleteMany({ questionId: question._id });

        await question.deleteOne();
        
        res.json({ message: 'Question and all associated data permanently deleted.' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/admin/answers/:id
const deleteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // clean up before removing the answer itself
        await Comment.deleteMany({ answerId: answer._id });
        await Like.deleteMany({ answerId: answer._id });

        await answer.deleteOne();
        res.json({ message: 'Answer and associated comments/likes removed' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/admin/questions/pending
const getPendingQuestions = async (req, res) => {
    try {
        const pendingQuestions = await Question.find({ isApproved: false, status: { $ne: 'deleted' } });
        res.json(pendingQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/admin/answers/pending
const getPendingAnswers = async (req, res) => {
    try {
        const pendingAnswers = await Answer.find({ isApproved: false });
        res.json(pendingAnswers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    toggleUserStatus,
    approveQuestion,
    approveAnswer,
    resolveQuestion,
    deleteQuestion,
    deleteAnswer,
    getPendingQuestions,
    getPendingAnswers
};