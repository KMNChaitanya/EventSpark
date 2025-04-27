const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateWallet } = require('../utils/wallet');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, 'is hashed password');
    const { address, privateKey } = generateWallet();

    user = new User({
      email,
      password: hashedPassword,
      role,
      walletAddress: '0x4f69d3b8AED3023716644349459fCf24165d20A8',
      walletPrivateKey: privateKey, // Store securely in production
    });

    console.log("user object is : ", user);

    const res1 = await user.save();
    console.log(res1, 'akfk;ajl');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { email, role, walletAddress: address } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login payload:', { email, password }); // Debug incoming payload
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    console.log('Stored hashed password:', user.password); // Debug stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Debug comparison result

    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res.json({ token, user: { email, role: user.role, walletAddress: user.walletAddress } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get current user (fetch user)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('email role walletAddress');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;