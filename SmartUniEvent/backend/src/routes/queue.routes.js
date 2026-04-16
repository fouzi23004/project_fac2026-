const express = require('express');
const router = express.Router();
const {
  joinQueue,
  getQueueStatus,
  leaveQueue,
} = require('../controllers/queue.controller');
const { protect } = require('../middleware/auth');

router.post('/join/:eventId', protect, joinQueue);
router.get('/status/:eventId', protect, getQueueStatus);
router.post('/leave/:eventId', protect, leaveQueue);

module.exports = router;
