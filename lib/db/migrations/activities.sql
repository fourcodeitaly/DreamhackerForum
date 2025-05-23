-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  target_id UUID NOT NULL,
  target_type VARCHAR(20) NOT NULL,
  category_id VARCHAR(255) REFERENCES categories(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_activity_type CHECK (type IN ('post_created', 'post_updated', 'post_deleted', 'comment_created', 'event_created', 'event_updated', 'event_deleted')),
  CONSTRAINT valid_target_type CHECK (target_type IN ('post', 'comment', 'event'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS activities_category_id_idx ON activities(category_id);
CREATE INDEX IF NOT EXISTS activities_target_idx ON activities(target_type, target_id); 