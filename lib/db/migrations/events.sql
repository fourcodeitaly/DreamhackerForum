-- Create events table
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schoolcode uuid NULL REFERENCES schools(schoolcode),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    capacity INTEGER NULL,
    registered_count INTEGER DEFAULT 0,
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_meeting_link VARCHAR(255),
    image_url VARCHAR(255),
    is_published BOOLEAN DEFAULT FALSE,
    created_user_id uuid NOT NULL REFERENCES users(id),
    organizer_name TEXT NOT NULL,
    organizer_email TEXT NOT NULL,
    organizer_phone TEXT NULL,
    organizer_website TEXT NULL,
    organizer_logo TEXT NULL,
    organizer_description TEXT NULL,
    organizer_location TEXT NULL,
    registration_url TEXT NULL,
    registration_deadline TIMESTAMP NOT NULL,
    registration_fee INTEGER NOT NULL,
    registration_currency VARCHAR(3) NOT NULL,
    registration_type VARCHAR(50) NOT NULL,
    registration_status VARCHAR(50) NOT NULL,
    registration_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'upcoming',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create event_registrations table
CREATE TABLE event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id),
    user_id uuid NOT NULL REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_events_schoolcode ON events(schoolcode);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 