const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    // role is intentionally not taken from the request body
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // always register as 'user' — admin accounts are seeded separately
        const user = await User.create({
            name,
            email,
            password,
            role: 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {

            if (!user.isActive) {
                return res.status(403).json({ message: 'Account deactivated' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

const checkEmailExists = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ exists: true });
        }
        res.status(200).json({ exists: false });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Generate password reset link (Console Log Hack)
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "There is no user with that email" });
        }

        // Generate a random token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Set token and 15-minute expiration
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        // THE FLEX: Log the link to the terminal instead of emailing it
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        console.log(`\n\n======================================================`);
        console.log(`PASSWORD RESET LINK REQUESTED FOR: ${user.email}`);
        console.log(`CLICK HERE: ${resetUrl}`);
        console.log(`======================================================\n\n`);

        res.status(200).json({ message: "Reset link generated! Check your server terminal." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Reset the password
// @route   PUT /api/users/resetpassword/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Find user by token and ensure it hasn't expired
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash the new password
        user.password = req.body.password;

        // Clear the token fields
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.log("[RESET PASSWORD CRASH]:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires Token)
const updateUserProfile = async (req, res) => {
  try {
    // Safety check: Did the Bouncer (protect middleware) let them in?
    if (!req.user) {
      return res.status(401).json({ message: "Wait! req.user is missing. Did you forget the 'protect' middleware?" });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password; 
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
      res.status(404).json({ message: "User not found in database" });
    }
  } catch (error) {
    // THE X-RAY: Send the exact crash reason to the frontend!
    res.status(500).json({ message: `Backend Crash: ${error.message}` });
  }
};


module.exports = { registerUser, loginUser, logoutUser, getAllUsers, checkEmailExists, forgotPassword, resetPassword, updateUserProfile };