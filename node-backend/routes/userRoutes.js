const express = require('express');
const { bookmarkEvent, getBookmarkedEvents, rsvpEvent, getProfile, bookEvent, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/bookmark/:eventId', bookmarkEvent);
router.get('/bookmarks', getBookmarkedEvents);
router.post('/rsvp/:eventId', rsvpEvent);
router.post('/book/:eventId', bookEvent);

module.exports = router;