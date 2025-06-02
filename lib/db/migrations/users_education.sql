-- Create user_education table for tracking schools
CREATE TABLE IF NOT EXISTS user_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_name TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS user_education_user_id_idx ON user_education(user_id);