const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Create event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Add user to req.body as organizer
    req.body.organizer = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const events = await Event.find()
      .populate('category', 'name icon')
      .populate('organizer', 'name')
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    const total = await Event.countDocuments();

    res.status(200).json({
      success: true,
      count: events.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'name icon')
      .populate('organizer', 'name')
      .populate('attendees', 'name');

    if (!event) {
      return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    if (error.name === 'CastError') {
       return res.status(404).json({ success: false, message: `Event not found with id of ${req.params.id}` });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:categoryId
// @access  Public
exports.getEventsByCategory = async (req, res) => {
  try {
    const events = await Event.find({ category: req.params.categoryId })
      .populate('category', 'name icon')
      .populate('organizer', 'name');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
exports.searchEvents = async (req, res) => {
  try {
    const keyword = req.query.q ? {
      title: {
        $regex: req.query.q,
        $options: 'i'
      }
    } : {};

    const events = await Event.find({ ...keyword })
      .populate('category', 'name icon')
      .populate('organizer', 'name');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};