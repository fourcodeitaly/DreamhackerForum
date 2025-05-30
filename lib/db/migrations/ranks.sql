-- Create ranks table
CREATE TABLE IF NOT EXISTS ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    min_points INTEGER NOT NULL,
    frame_color VARCHAR(7) NOT NULL, -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster point-based queries
CREATE INDEX IF NOT EXISTS ranks_min_points_idx ON ranks(min_points);

-- Add rank_id to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS rank_id UUID REFERENCES ranks(id),
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;

-- Insert default military ranks
INSERT INTO ranks (name, min_points, frame_color) VALUES
    ('Recruit', 0, '#808080'), -- Gray
    ('Private', 100, '#4CAF50'), -- Green
    ('Corporal', 500, '#2196F3'), -- Blue
    ('Sergeant', 1000, '#9C27B0'), -- Purple
    ('Lieutenant', 2500, '#FF9800'), -- Orange
    ('Captain', 5000, '#F44336'), -- Red
    ('Major', 10000, '#E91E63'), -- Pink
    ('Colonel', 25000, '#673AB7'), -- Deep Purple
    ('General', 50000, '#FFD700'); -- Gold

-- Create function to update user's rank based on points
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total points
    NEW.total_points = (
        COALESCE((
            SELECT COUNT(*) * 2
            FROM posts
            WHERE user_id = NEW.id
        ), 0) +
        COALESCE((
            SELECT COUNT(*)
            FROM comments
            WHERE user_id = NEW.id
        ), 0) +
        COALESCE((
            SELECT COUNT(*)
            FROM post_likes pl
            JOIN posts p ON pl.post_id = p.id
            WHERE p.user_id = NEW.id
        ), 0) +
        COALESCE((
            SELECT COUNT(*)
            FROM comment_likes cl
            JOIN comments c ON cl.comment_id = c.id
            WHERE c.user_id = NEW.id
        ), 0)
    );

    -- Update rank based on points
    NEW.rank_id = (
        SELECT id
        FROM ranks
        WHERE min_points <= NEW.total_points
        ORDER BY min_points DESC
        LIMIT 1
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update rank
CREATE TRIGGER update_user_rank_trigger
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank(); 