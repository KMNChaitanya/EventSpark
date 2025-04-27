const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { findById } = require('../models/User');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  
  try {
    const event = new Event({ ...req.body, organizer: req.user.userId });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;