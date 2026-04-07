const User = require('../models/User');
const Event = require('../models/Event');
const Category = require('../models/Category');

// @desc    Get admin statistics
// @route   GET /api/users/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalCategories = await Category.countDocuments();
    const activeAdmins = await User.countDocuments({ role: 'admin' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalCategories,
        activeAdmins
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users/admin/all
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'bookings.event',
        populate: {
          path: 'category',
          select: 'name icon color'
        }
      })
      .populate({
        path: 'bookmarks',
        populate: {
          path: 'category',
          select: 'name icon color'
        }
      });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bookmark an event
// @route   POST /api/users/bookmark/:eventId
// @access  Private
exports.bookmarkEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if already bookmarked and toggle atomically (avoids triggering pre-save hook)
    const isBookmarked = await User.exists({ _id: req.user.id, bookmarks: req.params.eventId });

    if (isBookmarked) {
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { bookmarks: req.params.eventId } },
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'Event removed from bookmarks', data: updated.bookmarks });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookmarks: req.params.eventId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Event bookmarked', data: updated.bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's bookmarked events
// @route   GET /api/users/bookmarks
// @access  Private
exports.getBookmarkedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: {
        path: 'category',
        select: 'name icon'
      }
    });

    res.status(200).json({
      success: true,
      count: user.bookmarks.length,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book tickets for an event
// @route   POST /api/users/book/:eventId
// @access  Private
exports.bookEvent = async (req, res) => {
  try {
    const { ticketCount } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!ticketCount || ticketCount < 1) {
      return res.status(400).json({ success: false, message: 'Please provide a valid ticket count' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add booking to user
    user.bookings.push({
      event: req.params.eventId,
      ticketCount,
      bookingDate: new Date()
    });

    // Also add user to event attendees if not already there
    if (!event.attendees.includes(req.user.id)) {
      event.attendees.push(req.user.id);
      await event.save();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully booked tickets!',
      data: user.bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    RSVP / join event
// @route   POST /api/users/rsvp/:eventId
// @access  Private
exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user already RSVP'd
    if (event.attendees.includes(req.user.id)) {
      // Remove RSVP
      event.attendees = event.attendees.filter(
        (id) => id.toString() !== req.user.id
      );
      await event.save();
      return res.status(200).json({ success: true, message: 'RSVP cancelled' });
    }

    // Add RSVP
    event.attendees.push(req.user.id);
    await event.save();

    res.status(200).json({ success: true, message: 'Successfully RSVP\'d for the event' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};