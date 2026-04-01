const express = require('express');
const { body } = require('express-validator');
const {
  createEvent,
  getEvents,
  getEvent,
  getEventsByCategory,
  searchEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', searchEvents);
router.get('/category/:categoryId', getEventsByCategory);

router.route('/')
  .get(getEvents)
  .post(
    protect,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('category', 'Category is required').not().isEmpty(),
      body('locationName', 'Location name is required').not().isEmpty(),
      body('latitude', 'Latitude is required').isNumeric(),
      body('longitude', 'Longitude is required').isNumeric(),
      body('eventDate', 'Event date is required').not().isEmpty(),
      body('price', 'Price must be a number').isNumeric()
    ],
    createEvent
  );

router.route('/:id').get(getEvent);

module.exports = router;