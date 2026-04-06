const express = require('express');
const { bookmarkEvent, getBookmarkedEvents, rsvpEvent, getProfile, updateProfile, bookEvent, getAdminStats, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Admin routes
router.get('/admin/stats', authorize('admin'), getAdminStats);
router.get('/admin/all', authorize('admin'), getAllUsers);

// Regular user routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/bookmark/:eventId', bookmarkEvent);
router.get('/bookmarks', getBookmarkedEvents);
router.post('/rsvp/:eventId', rsvpEvent);
router.post('/book/:eventId', bookEvent);

module.exports = router;