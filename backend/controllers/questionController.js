const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { Comment, Like } = require('../models/Interactions');
const nodemailer = require('nodemailer');

// transporter created once so it's not rebuilt on every request
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @route   POST /api/questions
const createQuestion = async (req, res) => {
    const { topic, title, description, tags, imageUrl } = req.body;

    try {
        const question = await Question.create({
            userId: req.user._id,
            topic,
            title,
            description,
            tags,
            imageUrl
        });

        try {
            await transporter.sendMail({
                from: '"DoConnect Admin" <noreply@doconnect.com>', 
                to: process.env.ADMIN_EMAIL,
                subject: '[ACTION REQUIRED] New Question Pending Approval', 
                html: `
                    <h3>New Question Alert</h3>
                    <p>A new question titled <b>"${question.title}"</b> has been posted.</p>
                    <p>Log in to the Admin Dashboard to approve or reject it.</p>
                `
            });
            console.log("[EMAIL] Question notification sent.");
        } catch (emailError) {
            console.error("[EMAIL] Failed to notify admin:", emailError);
        }

        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/questions
const getQuestions = async (req, res) => {
    try {
        // search across title, topic and tags
        const keyword = req.query.keyword
            ? {
                  $or: [
                      { title: { $regex: req.query.keyword, $options: 'i' } },
                      { topic: { $regex: req.query.keyword, $options: 'i' } },
                      { tags: { $regex: req.query.keyword, $options: 'i' } } 
                  ]
              }
            : {};

        const questions = await Question.find({ ...keyword, isApproved: true })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean(); 

        for (let question of questions) {
            const approvedAnswers = await Answer.find({ questionId: question._id, isApproved: true }).lean();
            question.answers = approvedAnswers;

            let totalLikes = 0;
            for (let answer of approvedAnswers) {
                const likeCount = await Like.countDocuments({ answerId: answer._id });
                totalLikes += likeCount;
            }
            question.likes = totalLikes;
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/questions/:id
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('userId', 'name');

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // admins can preview unapproved questions, regular users can't
        if (!question.isApproved && req.user?.role !== 'admin') {
            return res.status(404).json({ message: 'Question not found or not approved yet' });
        }

        const answers = await Answer.find({ questionId: question._id, isApproved: true })
            .populate('userId', 'name')
            .lean();

        for (let answer of answers) {
            answer.comments = await Comment.find({ answerId: answer._id }).populate('userId', 'name');
            answer.likesCount = await Like.countDocuments({ answerId: answer._id });
            
            if (req.user) {
                const userLike = await Like.findOne({ answerId: answer._id, userId: req.user._id });
                answer.userHasLiked = !!userLike; 
            }
        }

        res.json({ question, answers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   POST /api/questions/:id/answers
const createAnswer = async (req, res) => {
    const { body } = req.body;

    try {
        const question = await Question.findById(req.params.id);

        if (!question) return res.status(404).json({ message: 'Question not found' });
        if (question.status === 'resolved') return res.status(400).json({ message: 'This discussion thread is closed.' });

        const answer = await Answer.create({
            questionId: question._id,
            userId: req.user._id,
            body
        });

        try {
            await transporter.sendMail({
                from: '"DoConnect Admin" <noreply@doconnect.com>', 
                to: process.env.ADMIN_EMAIL,
                subject: '[ACTION REQUIRED] New Answer Pending Approval', 
                html: `
                    <h3>New Answer Alert</h3>
                    <p>A user has posted a new answer to the question: <b>"${question.title}"</b></p>
                    <p>Log in to the Admin Dashboard to review and approve it.</p>
                `
            });
            console.log("[EMAIL] Answer notification sent.");
        } catch (emailError) {
            console.error("[EMAIL] Failed to notify admin:", emailError);
        }

        res.status(201).json(answer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   POST /api/questions/answers/:id/comments
const addComment = async (req, res) => {
    const { body } = req.body;

    try {
        const comment = await Comment.create({
            answerId: req.params.id,
            userId: req.user._id,
            body
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   POST /api/questions/answers/:id/like
const toggleLike = async (req, res) => {
    try {
        const existingLike = await Like.findOne({ answerId: req.params.id, userId: req.user._id });

        if (existingLike) {
            await existingLike.deleteOne();
            res.json({ message: 'Answer unliked' });
        } else {
            await Like.create({ answerId: req.params.id, userId: req.user._id });
            res.status(201).json({ message: 'Answer liked' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   POST /api/questions/:id/vote
const voteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        const { voteType } = req.body; 
        const userId = req.user._id;

        // clear any existing vote first, then apply the new one
        question.upvotes = question.upvotes.filter(id => id.toString() !== userId.toString());
        question.downvotes = question.downvotes.filter(id => id.toString() !== userId.toString());

        if (voteType === 'upvote') {
            question.upvotes.push(userId);
        } else if (voteType === 'downvote') {
            question.downvotes.push(userId);
        }

        await question.save();
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/questions/answers/comments/:commentId
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // only the comment owner or an admin can delete it
        if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createQuestion,
    getQuestions,
    getQuestionById,
    createAnswer,
    addComment,
    toggleLike,
    voteQuestion,
    deleteComment
};