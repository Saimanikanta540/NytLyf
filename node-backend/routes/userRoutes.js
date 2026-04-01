const express = require('express');
const { bookmarkEvent, getBookmarkedEvents, rsvpEvent, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.post('/bookmark/:eventId', bookmarkEvent);
router.get('/bookmarks', getBookmarkedEvents);
router.post('/rsvp/:eventId', rsvpEvent);

module.exports = router;