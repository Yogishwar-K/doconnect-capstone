const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    // stores user IDs so we can prevent double voting
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
    imageUrl: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
    status: { type: String, enum: ['open', 'resolved', 'deleted'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);