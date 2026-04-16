const crypto = require('crypto');
const db = require('../config/database');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    // Get total events
    const eventsResult = await db.query(
      'SELECT COUNT(*) as count FROM events'
    );

    // Get total tickets sold
    const ticketsResult = await db.query(
      'SELECT COUNT(*) as count, SUM(payment_amount) as revenue FROM tickets WHERE payment_status = $1',
      ['completed']
    );

    // Get active users
    const usersResult = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE is_verified = TRUE'
    );

    // Get upcoming events
    const upcomingResult = await db.query(
      'SELECT COUNT(*) as count FROM events WHERE date >= CURRENT_DATE AND status = $1',
      ['active']
    );

    res.json({
      success: true,
      stats: {
        totalEvents: parseInt(eventsResult.rows[0].count),
        totalTicketsSold: parseInt(ticketsResult.rows[0].count) || 0,
        totalRevenue: parseFloat(ticketsResult.rows[0].revenue) || 0,
        activeUsers: parseInt(usersResult.rows[0].count),
        upcomingEvents: parseInt(upcomingResult.rows[0].count),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { role, isVerified, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT id, first_name, last_name, email, student_id, role, is_verified, created_at FROM users WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      params.push(role);
    }

    if (isVerified !== undefined) {
      paramCount++;
      query += ` AND is_verified = $${paramCount}`;
      params.push(isVerified === 'true');
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      users: result.rows.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        studentId: user.student_id,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role, isVerified } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (role) {
      updates.push(`role = $${paramCount}`);
      params.push(role);
      paramCount++;
    }

    if (isVerified !== undefined) {
      updates.push(`is_verified = $${paramCount}`);
      params.push(isVerified);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    params.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, role`;

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'UPDATE_USER', 'user', userId, JSON.stringify({ role, isVerified })]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Scan and validate ticket
// @route   POST /api/admin/scan-ticket
// @access  Private/Admin
exports.scanTicket = async (req, res, next) => {
  try {
    const { qrData } = req.body;

    // Parse QR data
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (err) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Invalid QR code format',
      });
    }

    const { eventId, userId } = parsedData;

    // Get ticket details by matching the qr_data field
    const ticketResult = await db.query(
      `SELECT t.*, e.title, e.date, e.time, u.first_name, u.last_name, u.email
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       JOIN users u ON t.user_id = u.id
       WHERE t.qr_data = $1`,
      [qrData]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Ticket not found',
      });
    }

    const ticket = ticketResult.rows[0];

    // Validate QR hash
    const qrCodeHash = crypto.createHash('sha256').update(qrData).digest('hex');

    if (qrCodeHash !== ticket.qr_code_hash) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Invalid QR code signature',
      });
    }

    // Check if already used
    if (ticket.is_used) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Ticket already used',
        usedAt: ticket.used_at,
      });
    }

    // Mark ticket as used
    await db.query(
      'UPDATE tickets SET is_used = TRUE, used_at = NOW() WHERE id = $1',
      [ticket.id]
    );

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'SCAN_TICKET', 'ticket', ticket.id, JSON.stringify({ eventId, scannedBy: req.user.email })]
    );

    res.json({
      success: true,
      valid: true,
      message: 'Ticket validated successfully',
      ticket: {
        ticketNumber: ticket.ticket_number,
        eventName: ticket.title,
        holderName: `${ticket.first_name} ${ticket.last_name}`,
        holderEmail: ticket.email,
        eventDate: ticket.date,
        eventTime: ticket.time,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event analytics
// @route   GET /api/admin/events/:eventId/analytics
// @access  Private/Admin
exports.getEventAnalytics = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const result = await db.query(
      'SELECT * FROM event_stats WHERE id = $1',
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      analytics: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
