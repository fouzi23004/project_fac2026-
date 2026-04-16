const crypto = require('crypto');
const QRCode = require('qrcode');
const db = require('../config/database');

// Generate unique ticket number
const generateTicketNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `TKT-${year}-${random}`;
};

// @desc    Purchase ticket
// @route   POST /api/tickets/purchase/:eventId
// @access  Private
exports.purchaseTicket = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { paymentData } = req.body;

    // Use transaction to ensure ACID properties
    const result = await db.transaction(async (client) => {
      // Check if user already has a ticket
      const existingTicket = await client.query(
        'SELECT * FROM tickets WHERE event_id = $1 AND user_id = $2',
        [eventId, userId]
      );

      if (existingTicket.rows.length > 0) {
        throw new Error('You already have a ticket for this event');
      }

      // Get event details and lock row
      const event = await client.query(
        'SELECT * FROM events WHERE id = $1 FOR UPDATE',
        [eventId]
      );

      if (event.rows.length === 0) {
        throw new Error('Event not found');
      }

      const eventData = event.rows[0];

      if (eventData.available_tickets <= 0) {
        throw new Error('No tickets available');
      }

      // Decrease available tickets
      await client.query(
        'UPDATE events SET available_tickets = available_tickets - 1 WHERE id = $1',
        [eventId]
      );

      // Generate ticket data
      const ticketNumber = generateTicketNumber();
      const qrData = JSON.stringify({
        ticketId: crypto.randomUUID(),
        eventId,
        userId,
        timestamp: Date.now(),
        signature: crypto.randomBytes(32).toString('hex'),
      });

      const qrCodeHash = crypto.createHash('sha256').update(qrData).digest('hex');

      // Create ticket
      const ticketResult = await client.query(
        `INSERT INTO tickets (ticket_number, event_id, user_id, qr_code_hash, qr_data, payment_status, payment_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [ticketNumber, eventId, userId, qrCodeHash, qrData, 'completed', eventData.price]
      );

      // Remove from queue if exists
      await client.query(
        'DELETE FROM queue WHERE event_id = $1 AND user_id = $2',
        [eventId, userId]
      );

      return ticketResult.rows[0];
    });

    // Get user details
    const user = await db.query(
      'SELECT first_name, last_name, email FROM users WHERE id = $1',
      [userId]
    );

    // Get event details
    const event = await db.query(
      'SELECT title, date, time, location FROM events WHERE id = $1',
      [eventId]
    );

    res.status(201).json({
      success: true,
      message: 'Ticket purchased successfully',
      ticket: {
        id: result.id,
        ticketNumber: result.ticket_number,
        eventTitle: event.rows[0].title,
        eventDate: event.rows[0].date,
        eventTime: event.rows[0].time,
        location: event.rows[0].location,
        price: parseFloat(result.payment_amount),
        holderName: `${user.rows[0].first_name} ${user.rows[0].last_name}`,
        holderEmail: user.rows[0].email,
        qrData: result.qr_data,
        purchasedAt: result.purchased_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:ticketId
// @access  Private
exports.getTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `SELECT t.*, e.title, e.description, e.date, e.time, e.location, e.image_url, u.first_name, u.last_name, u.email
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       JOIN users u ON t.user_id = u.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [ticketId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    const ticket = result.rows[0];

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qr_data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        status: ticket.is_used ? 'used' : 'active',
        price: parseFloat(ticket.payment_amount),
        holderName: `${ticket.first_name} ${ticket.last_name}`,
        holderEmail: ticket.email,
        qrCodeData: qrCodeDataUrl,
        qrData: ticket.qr_data,
        isUsed: ticket.is_used,
        usedAt: ticket.used_at,
        purchasedAt: ticket.purchased_at,
        event: {
          title: ticket.title,
          date: ticket.date,
          time: ticket.time,
          location: ticket.location,
          imageUrl: ticket.image_url,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
exports.getUserTickets = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT t.*, e.title, e.date, e.time, e.location, e.image_url
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       WHERE t.user_id = $1
       ORDER BY t.purchased_at DESC`,
      [userId]
    );

    // Generate QR codes for all tickets
    const ticketsWithQR = await Promise.all(
      result.rows.map(async (ticket) => {
        const qrCodeDataUrl = await QRCode.toDataURL(ticket.qr_data, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        return {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          price: parseFloat(ticket.payment_amount),
          status: ticket.is_used ? 'used' : 'active',
          purchasedAt: ticket.purchased_at,
          qrCodeData: qrCodeDataUrl,
          event: {
            title: ticket.title,
            date: ticket.date,
            time: ticket.time,
            location: ticket.location,
            imageUrl: ticket.image_url || null,
          },
        };
      })
    );

    res.json({
      success: true,
      count: ticketsWithQR.length,
      tickets: ticketsWithQR,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate ticket
// @route   POST /api/tickets/validate/:ticketId
// @access  Private
exports.validateTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { qrData } = req.body;

    const result = await db.query(
      'SELECT * FROM tickets WHERE id = $1',
      [ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Ticket not found',
      });
    }

    const ticket = result.rows[0];

    // Validate QR data
    const qrCodeHash = crypto.createHash('sha256').update(qrData).digest('hex');

    if (qrCodeHash !== ticket.qr_code_hash) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Invalid QR code',
      });
    }

    if (ticket.is_used) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Ticket already used',
        usedAt: ticket.used_at,
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Ticket is valid',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
