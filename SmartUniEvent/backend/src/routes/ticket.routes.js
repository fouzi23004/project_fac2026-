const express = require('express');
const router = express.Router();
const {
  purchaseTicket,
  getTicket,
  getUserTickets,
  validateTicket,
} = require('../controllers/ticket.controller');
const { protect } = require('../middleware/auth');

router.post('/purchase/:eventId', protect, purchaseTicket);
router.get('/my-tickets', protect, getUserTickets);
router.get('/:ticketId', protect, getTicket);
router.post('/validate/:ticketId', protect, validateTicket);

module.exports = router;
