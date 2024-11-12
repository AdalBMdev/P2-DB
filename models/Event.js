// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  date: Date,
  location: {
    city: String,
    address: String
  },
  status: {
    isPaid: Boolean,
    requiresAgeVerification: Boolean
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Event', eventSchema);
