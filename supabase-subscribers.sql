-- ═══ MAISON GETHSE — SUBSCRIBERS (Letters from the Maison) ═══
-- Run this in the Supabase SQL editor after supabase-schema.sql

-- 4. Subscribers (newsletter / drop announcements)
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  source TEXT DEFAULT 'popup',
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- RLS on, with NO anon policies — all access goes through the
-- SECURITY DEFINER functions below, so emails are never readable
-- with the public anon key.
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Subscribe (or quietly re-subscribe someone who left).
-- Returns { token, already } — `already` is true when they were
-- subscribed before this call, so we don't re-send the welcome letter.
CREATE OR REPLACE FUNCTION subscribe_email(p_email TEXT, p_source TEXT DEFAULT 'popup')
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_row subscribers%ROWTYPE;
  v_already BOOLEAN := false;
BEGIN
  IF v_email IS NULL OR v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RAISE EXCEPTION 'invalid email';
  END IF;

  SELECT * INTO v_row FROM subscribers WHERE email = v_email;
  IF FOUND THEN
    v_already := (v_row.status = 'subscribed');
    UPDATE subscribers
      SET status = 'subscribed', unsubscribed_at = NULL
      WHERE email = v_email
      RETURNING * INTO v_row;
  ELSE
    INSERT INTO subscribers (email, source) VALUES (v_email, p_source)
      RETURNING * INTO v_row;
  END IF;

  RETURN json_build_object('token', v_row.unsubscribe_token, 'already', v_already);
END $$;

-- One-click unsubscribe by token (from the email footer link).
CREATE OR REPLACE FUNCTION unsubscribe_by_token(p_token UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count INT;
BEGIN
  UPDATE subscribers
    SET status = 'unsubscribed', unsubscribed_at = NOW()
    WHERE unsubscribe_token = p_token AND status = 'subscribed';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END $$;

GRANT EXECUTE ON FUNCTION subscribe_email(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION unsubscribe_by_token(UUID) TO anon;
