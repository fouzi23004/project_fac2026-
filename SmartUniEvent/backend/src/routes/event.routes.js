const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('admin', 'superadmin'), validateEvent, createEvent);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateEvent);
router.delete('/:id', protect, authorize('superadmin'), deleteEvent);

module.exports = router;
