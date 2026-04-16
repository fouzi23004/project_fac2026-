const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUser,
  scanTicket,
  getEventAnalytics,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:userId', updateUser);
router.post('/scan-ticket', scanTicket);
router.get('/events/:eventId/analytics', getEventAnalytics);

module.exports = router;
