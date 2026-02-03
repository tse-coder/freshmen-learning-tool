-- Migration: User Activity Tracking System
-- Description: Creates tables for tracking user visits with 30-day retention and monthly summaries
-- Date: 2026-01-29

-- ============================================================================
-- Table: user_activity
-- Purpose: Track individual user visits with detailed timestamps
-- Retention: 30 days (older records will be archived to monthly summaries)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  page_path TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_visited_at ON user_activity(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, visited_at DESC);

-- Enable Row Level Security
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (rate limited by API)
DROP POLICY IF EXISTS "Allow activity insert" ON user_activity;
CREATE POLICY "Allow activity insert" ON user_activity
  FOR INSERT WITH CHECK (true);

-- Policy: Allow anyone to select (can add auth check later if needed)
DROP POLICY IF EXISTS "Allow activity select" ON user_activity;
CREATE POLICY "Allow activity select" ON user_activity
  FOR SELECT USING (true);

-- ============================================================================
-- Table: monthly_activity_summary
-- Purpose: Store aggregated monthly statistics when old data is deleted
-- This table preserves historical insights without storing detailed records
-- ============================================================================

CREATE TABLE IF NOT EXISTS monthly_activity_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL, -- 1-12
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_users INTEGER NOT NULL DEFAULT 0,
  most_active_day INTEGER, -- Day of month (1-31)
  most_active_day_visits INTEGER,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  top_users JSONB, -- Array of {user_id, username, visit_count}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year, month)
);

-- Index for querying by year/month
CREATE INDEX IF NOT EXISTS idx_monthly_summary_year_month ON monthly_activity_summary(year DESC, month DESC);

-- Enable Row Level Security
ALTER TABLE monthly_activity_summary ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to select summaries
DROP POLICY IF EXISTS "Allow summary select" ON monthly_activity_summary;
CREATE POLICY "Allow summary select" ON monthly_activity_summary
  FOR SELECT USING (true);

-- Policy: Allow inserts and updates (for automated archiving)
DROP POLICY IF EXISTS "Allow summary insert" ON monthly_activity_summary;
CREATE POLICY "Allow summary insert" ON monthly_activity_summary
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow summary update" ON monthly_activity_summary;
CREATE POLICY "Allow summary update" ON monthly_activity_summary
  FOR UPDATE USING (true);

-- ============================================================================
-- Function: archive_old_activity_to_summary
-- Purpose: Archives activity older than 30 days into monthly summaries
-- This function should be called periodically (e.g., daily via cron job)
-- ============================================================================

CREATE OR REPLACE FUNCTION archive_old_activity_to_summary()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  cutoff_date DATE;
  activity_record RECORD;
BEGIN
  -- Calculate cutoff date (30 days ago)
  cutoff_date := CURRENT_DATE - INTERVAL '30 days';
  
  -- Process each month that has old activity
  FOR activity_record IN
    SELECT 
      EXTRACT(YEAR FROM visited_at)::INTEGER as year,
      EXTRACT(MONTH FROM visited_at)::INTEGER as month,
      MIN(visited_at::DATE) as date_start,
      MAX(visited_at::DATE) as date_end,
      COUNT(*) as total_visits,
      COUNT(DISTINCT user_id) as unique_users
    FROM user_activity
    WHERE visited_at::DATE < cutoff_date
    GROUP BY EXTRACT(YEAR FROM visited_at), EXTRACT(MONTH FROM visited_at)
  LOOP
    -- Calculate most active day for this month
    WITH daily_stats AS (
      SELECT 
        EXTRACT(DAY FROM visited_at)::INTEGER as day,
        COUNT(*) as visits
      FROM user_activity
      WHERE EXTRACT(YEAR FROM visited_at) = activity_record.year
        AND EXTRACT(MONTH FROM visited_at) = activity_record.month
        AND visited_at::DATE < cutoff_date
      GROUP BY EXTRACT(DAY FROM visited_at)
      ORDER BY visits DESC
      LIMIT 1
    ),
    top_users_data AS (
      SELECT 
        jsonb_agg(
          jsonb_build_object(
            'user_id', user_id,
            'username', u.username,
            'first_name', u.first_name,
            'visit_count', visit_count
          )
          ORDER BY visit_count DESC
        ) as top_users_json
      FROM (
        SELECT 
          ua.user_id,
          COUNT(*) as visit_count
        FROM user_activity ua
        WHERE EXTRACT(YEAR FROM ua.visited_at) = activity_record.year
          AND EXTRACT(MONTH FROM ua.visited_at) = activity_record.month
          AND ua.visited_at::DATE < cutoff_date
        GROUP BY ua.user_id
        ORDER BY visit_count DESC
        LIMIT 10
      ) user_stats
      LEFT JOIN users u ON u.id = user_stats.user_id
    )
    -- Insert or update monthly summary
    INSERT INTO monthly_activity_summary (
      year,
      month,
      total_visits,
      unique_users,
      most_active_day,
      most_active_day_visits,
      date_range_start,
      date_range_end,
      top_users,
      updated_at
    )
    SELECT 
      activity_record.year,
      activity_record.month,
      activity_record.total_visits,
      activity_record.unique_users,
      ds.day,
      ds.visits,
      activity_record.date_start,
      activity_record.date_end,
      tud.top_users_json,
      NOW()
    FROM daily_stats ds, top_users_data tud
    ON CONFLICT (year, month) 
    DO UPDATE SET
      total_visits = EXCLUDED.total_visits,
      unique_users = EXCLUDED.unique_users,
      most_active_day = EXCLUDED.most_active_day,
      most_active_day_visits = EXCLUDED.most_active_day_visits,
      date_range_end = EXCLUDED.date_range_end,
      top_users = EXCLUDED.top_users,
      updated_at = NOW();
  END LOOP;
  
  -- Delete archived activity records
  DELETE FROM user_activity WHERE visited_at::DATE < cutoff_date;
END;
$$;

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE user_activity IS 'Tracks individual user visits. Records older than 30 days are automatically archived to monthly_activity_summary.';
COMMENT ON TABLE monthly_activity_summary IS 'Contains aggregated monthly statistics for archived user activity data.';
COMMENT ON FUNCTION archive_old_activity_to_summary IS 'Archives activity data older than 30 days into monthly summaries and deletes the old detailed records. Should be run daily.';

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_activity', 'monthly_activity_summary');

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('user_activity', 'monthly_activity_summary');

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('user_activity', 'monthly_activity_summary');
