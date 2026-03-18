const { Message } = require('../models/Interactions');
const User = require('../models/User');

// @route   POST /api/chat/:receiverId
const sendMessage = async (req, res) => {
    try {
        const receiver = await User.findById(req.params.receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        const message = await Message.create({
            senderId: req.user._id,
            receiverId: req.params.receiverId,
            message: req.body.message
        });

        const io = req.app.get('io');
        
        // only emit to the two people involved, not everyone
        io.to(req.params.receiverId).emit('receive_message', message);
        io.to(req.user._id.toString()).emit('receive_message', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/chat/:userId
const getChatHistory = async (req, res) => {
    try {
        // both directions — messages sent and received
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.user._id }
            ]
        }).sort({ createdAt: 1 }); // oldest first

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getChatHistory
};