const express = require('express');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const { simulateBaseTransaction } = require('../blockchain/baseSimulator');

const router = express.Router();

router.post('/buy', auth, async (req, res) => {
  const { eventId, price } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event || event.tickets <= 0) {
      return res.status(400).json({ error: 'No tickets available' });
    }

    // Simulate blockchain transaction
    const tx = await simulateBaseTransaction(req.user.userId, 'website', price);
    if (!tx.success) {
      return res.status(500).json({ error: 'Transaction failed' });
    }

    const ticket = new Ticket({
      event: eventId,
      owner: req.user.userId,
      price,
    });
    await ticket.save();

    event.tickets -= 1;
    await event.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resell', auth, async (req, res) => {
  const { ticketId, price } = req.body;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Simulate blockchain transaction (5% fee to website)
    const tx = await simulateBaseTransaction(req.user.userId, 'website', price * 0.05);
    if (!tx.success) {
      return res.status(500).json({ error: 'Transaction failed' });
    }

    ticket.status = 'resale';
    ticket.price = price;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/owned', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ owner: req.user.userId }).populate('event');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;