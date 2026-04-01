const express = require('express');
const { body } = require('express-validator');
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(
    protect,
    [
      body('name', 'Category name is required').not().isEmpty()
    ],
    createCategory
  );

module.exports = router;