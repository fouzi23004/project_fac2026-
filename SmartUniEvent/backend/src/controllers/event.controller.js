const db = require('../config/database');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res, next) => {
  try {
    const { category, status = 'active', limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM events WHERE 1=1';
    let params = [];
    let paramCount = 0;

    // Only filter by status if it's not 'all'
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    query += ` ORDER BY date ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      events: result.rows.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        time: event.time,
        location: event.location,
        price: parseFloat(event.price),
        totalTickets: event.total_tickets,
        availableTickets: event.available_tickets,
        imageUrl: event.image_url,
        status: event.status,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const event = result.rows[0];

    res.json({
      success: true,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        time: event.time,
        location: event.location,
        price: parseFloat(event.price),
        totalTickets: event.total_tickets,
        availableTickets: event.available_tickets,
        imageUrl: event.image_url,
        status: event.status,
        createdAt: event.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, category, date, time, location, price, totalTickets, imageUrl } = req.body;

    const result = await db.query(
      `INSERT INTO events (title, description, category, date, time, location, price, total_tickets, available_tickets, image_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10)
       RETURNING *`,
      [title, description, category, date, time, location, price || 0, totalTickets, imageUrl, req.user.id]
    );

    const event = result.rows[0];

    // Log audit
    await db.query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'CREATE_EVENT', 'event', event.id]
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: event.id,
        title: event.title,
        totalTickets: event.total_tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (['title', 'description', 'category', 'date', 'time', 'location', 'price', 'status'].includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    values.push(id);
    const query = `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/SuperAdmin
exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
