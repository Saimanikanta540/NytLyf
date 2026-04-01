const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'default-icon.png'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create virtual id from _id
categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Category', categorySchema);