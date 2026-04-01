const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  locationName: {
    type: String,
    required: [true, 'Please add a location name']
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Please add a date']
  },
  price: {
    type: Number,
    default: 0
  },
  availableTickets: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isTrending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create virtual id from _id
eventSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Create index for search
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);