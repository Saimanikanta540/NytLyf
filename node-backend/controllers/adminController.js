const User = require('../models/User');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && user.isAdmin && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all regular users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: { $ne: true } }).select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all events with booking details
// @route   GET /api/admin/events
// @access  Private/Admin
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('category', 'name')
      .populate('organizer', 'name email')
      .populate('attendees', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};