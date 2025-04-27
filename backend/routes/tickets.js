const express = require('express');
const { ethers } = require('ethers');
const auth = require('../middleware/auth');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Event = require('../models/Event');
const router = express.Router();

// FakeCoin ABI (simplified)
const fakeCoinAbi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
];

// Buy ticket with FakeCoin
router.post('/buy/:eventId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const event = await Event.findById(req.eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Connect to Base Sepolia
    const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
    const wallet = new ethers.Wallet(user.walletPrivateKey, provider);
    const contract = new ethers.Contract('YOUR_FAKECOIN_CONTRACT_ADDRESS', fakeCoinAbi, wallet);

    // Transfer FakeCoin to organizer
    const organizer = await User.findById(event.organizerId);
    const ticketPrice = ethers.parseUnits(event.ticketPrice.toString(), 18); // Assuming 18 decimals
    const tx = await contract.transfer(organizer.walletAddress, ticketPrice);
    await tx.wait();

    // Create ticket
    const ticket = new Ticket({
      eventId: event._id,
      attendeeId: user._id,
      purchaseDate: new Date(),
      transactionHash: tx.hash,
    });

    await ticket.save();
    res.json({ msg: 'Ticket purchased successfully', ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;