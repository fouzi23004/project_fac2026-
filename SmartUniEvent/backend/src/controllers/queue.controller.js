const db = require('../config/database');

// @desc    Join queue for an event
// @route   POST /api/queue/join/:eventId
// @access  Private
exports.joinQueue = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists and has available tickets
    const event = await db.query(
      'SELECT id, title, available_tickets FROM events WHERE id = $1 AND status = $2',
      [eventId, 'active']
    );

    if (event.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or not active',
      });
    }

    if (event.rows[0].available_tickets <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No tickets available',
      });
    }

    // Check if user is already in queue
    const existingQueue = await db.query(
      'SELECT * FROM queue WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existingQueue.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already in the queue for this event',
      });
    }

    // Check if user already has a ticket
    const existingTicket = await db.query(
      'SELECT * FROM tickets WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existingTicket.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You already have a ticket for this event',
      });
    }

    // Get current queue length
    const queueLength = await db.query(
      'SELECT COUNT(*) as count FROM queue WHERE event_id = $1 AND status = $2',
      [eventId, 'waiting']
    );

    const position = parseInt(queueLength.rows[0].count) + 1;

    // Add user to queue
    const result = await db.query(
      `INSERT INTO queue (event_id, user_id, position, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '30 minutes')
       RETURNING *`,
      [eventId, userId, position]
    );

    const queueEntry = result.rows[0];

    // Calculate estimated wait time (2 minutes per position)
    const estimatedWaitMinutes = Math.max(1, Math.floor(position / 50) * 2);

    res.status(201).json({
      success: true,
      message: 'Added to queue successfully',
      queue: {
        id: queueEntry.id,
        position,
        totalInQueue: position,
        estimatedWaitTime: estimatedWaitMinutes,
        status: queueEntry.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get queue status
// @route   GET /api/queue/status/:eventId
// @access  Private
exports.getQueueStatus = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'SELECT * FROM queue WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Not in queue',
      });
    }

    const queueEntry = result.rows[0];

    // Get total in queue
    const totalResult = await db.query(
      'SELECT COUNT(*) as count FROM queue WHERE event_id = $1 AND status = $2',
      [eventId, 'waiting']
    );

    const totalInQueue = parseInt(totalResult.rows[0].count);
    const estimatedWaitMinutes = Math.max(1, Math.floor(queueEntry.position / 50) * 2);

    res.json({
      success: true,
      queue: {
        position: queueEntry.position,
        totalInQueue,
        estimatedWaitTime: estimatedWaitMinutes,
        status: queueEntry.status,
        joinedAt: queueEntry.joined_at,
        expiresAt: queueEntry.expires_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave queue
// @route   POST /api/queue/leave/:eventId
// @access  Private
exports.leaveQueue = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      'DELETE FROM queue WHERE event_id = $1 AND user_id = $2 RETURNING position',
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Not in queue',
      });
    }

    // Update positions of users after this user
    await db.query(
      'UPDATE queue SET position = position - 1 WHERE event_id = $1 AND position > $2',
      [eventId, result.rows[0].position]
    );

    res.json({
      success: true,
      message: 'Left queue successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
