-- ═══ MAISON GETHSE — FEEDBACK (questions & bug reports) ═══
-- Run this in the Supabase SQL editor.

CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'question' CHECK (type IN ('question', 'bug', 'other')),
  email TEXT,
  message TEXT NOT NULL,
  page TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS on. Anyone may submit; nobody can read with the public anon key
-- (no SELECT policy), so messages stay private to the owner.
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON feedback FOR INSERT WITH CHECK (true);
