const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUserProfileActivity = async (req, res) => {
    try {
        const myQuestions = await Question.find({ userId: req.user._id });
        const myAnswers = await Answer.find({ userId: req.user._id });

        // admins also get a summary of closed and deleted threads
        let adminActivity = null;
        if (req.user.role === 'admin') {
            const closedThreads = await Question.find({ status: 'resolved' });
            const deletedThreads = await Question.find({ status: 'deleted' });
            adminActivity = { closedThreads, deletedThreads };
        }

        res.json({ 
            questions: myQuestions, 
            answers: myAnswers,
            adminActivity
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile data', error: error.message });
    }
};


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires Token)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const { name, email, currentPassword, password: newPassword } = req.body;

      // 1. SECURITY CHECK: Did they provide a current password?
      if (!currentPassword) {
        return res.status(400).json({ message: "Please enter your current password to save changes." });
      }

      // 2. SECURITY CHECK: Does it match the database?
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current password. Changes not saved." });
      }

      // 3. IF IT MATCHES, apply the updates
      user.name = name || user.name;
      user.email = email || user.email;

      // Only update the new password if they actually typed one
      if (newPassword) {
        user.password = newPassword; 
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        message: "Profile updated successfully!"
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("[PROFILE]:", error);
    res.status(500).json({ message: `[PROFILE]: ${error.message}` });
  }
};

module.exports = { getUserProfileActivity, updateUserProfile };