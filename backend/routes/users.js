const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user by ID (protected route)
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('walletAddress');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
    console.log(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;