const express = require('express');
const { adminLogin, getAllUsers, getAllEvents } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', protect, adminProtect, getAllUsers);
router.get('/events', protect, adminProtect, getAllEvents);

module.exports = router;