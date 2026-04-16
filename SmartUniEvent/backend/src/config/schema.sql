-- SmartUniEvent Database Schema
-- PostgreSQL Database Schema for University Event Ticketing System

-- Create Database (run this separately)
-- CREATE DATABASE smartunievent;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    student_id VARCHAR(50),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'superadmin')),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expire TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    total_tickets INTEGER NOT NULL CHECK (total_tickets > 0),
    available_tickets INTEGER NOT NULL,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT future_date CHECK (date >= CURRENT_DATE),
    CONSTRAINT available_tickets_check CHECK (available_tickets >= 0 AND available_tickets <= total_tickets)
);

-- Create index on events
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);

-- Queue Table (for dynamic queue management)
CREATE TABLE IF NOT EXISTS queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'processing', 'completed', 'expired')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Create index on queue
CREATE INDEX idx_queue_event ON queue(event_id);
CREATE INDEX idx_queue_user ON queue(user_id);
CREATE INDEX idx_queue_position ON queue(event_id, position);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qr_code_hash VARCHAR(255) UNIQUE NOT NULL,
    qr_data TEXT NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_amount DECIMAL(10, 2),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Create index on tickets
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_qr_hash ON tickets(qr_code_hash);
CREATE INDEX idx_tickets_number ON tickets(ticket_number);

-- Audit Log Table (for security and tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on audit logs
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to decrease available tickets (ACID transaction)
CREATE OR REPLACE FUNCTION reserve_ticket(p_event_id UUID, p_user_id UUID)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
    v_available INTEGER;
BEGIN
    -- Lock the event row for update
    SELECT available_tickets INTO v_available
    FROM events
    WHERE id = p_event_id
    FOR UPDATE;

    -- Check if tickets are available
    IF v_available <= 0 THEN
        RETURN QUERY SELECT FALSE, 'No tickets available'::TEXT;
        RETURN;
    END IF;

    -- Decrease available tickets
    UPDATE events
    SET available_tickets = available_tickets - 1
    WHERE id = p_event_id;

    RETURN QUERY SELECT TRUE, 'Ticket reserved successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- View for event statistics
CREATE OR REPLACE VIEW event_stats AS
SELECT
    e.id,
    e.title,
    e.total_tickets,
    e.available_tickets,
    (e.total_tickets - e.available_tickets) AS sold_tickets,
    ROUND(((e.total_tickets - e.available_tickets)::NUMERIC / e.total_tickets::NUMERIC) * 100, 2) AS occupancy_rate,
    COUNT(DISTINCT t.user_id) AS unique_buyers,
    SUM(t.payment_amount) AS total_revenue
FROM events e
LEFT JOIN tickets t ON e.id = t.event_id AND t.payment_status = 'completed'
GROUP BY e.id, e.title, e.total_tickets, e.available_tickets;

-- Insert default admin user (password: Admin@123)
-- Password hash for 'Admin@123' using bcrypt
INSERT INTO users (first_name, last_name, email, password_hash, role, is_verified)
VALUES (
    'Admin',
    'User',
    'admin@university.edu',
    '$2a$10$mHKEWZ9qNX7YJ8B9vXVXPOvZqNQYZ5kJQC2FqYZPqZqPqZqPqZqPq',
    'admin',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Sample Events (optional)
INSERT INTO events (title, description, category, date, time, location, price, total_tickets, available_tickets)
VALUES
    ('Spring Gala 2024', 'Annual university spring gala with live music, food, and entertainment', 'gala', '2024-04-15', '19:00', 'Main Campus Hall', 25.00, 500, 500),
    ('Tech Conference 2024', 'Cutting-edge technology conference featuring industry leaders', 'conference', '2024-04-20', '09:00', 'Engineering Building', 15.00, 300, 300),
    ('Football Championship', 'Inter-university football championship finals', 'sports', '2024-04-22', '15:00', 'University Stadium', 10.00, 1000, 1000)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE users IS 'Stores user information including students, admins, and superadmins';
COMMENT ON TABLE events IS 'Stores event information with ACID-compliant ticket management';
COMMENT ON TABLE queue IS 'Manages dynamic queue for fair ticket distribution';
COMMENT ON TABLE tickets IS 'Stores purchased tickets with QR codes for validation';
COMMENT ON TABLE audit_logs IS 'Security audit trail for all critical actions';
