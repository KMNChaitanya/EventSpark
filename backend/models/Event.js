const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  tickets: { type: Number, required: true },
  price: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Event', eventSchema);