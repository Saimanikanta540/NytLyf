const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
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