-- ═══ MAISON GETHSE DATABASE SCHEMA ═══

-- 1. Garden Seeds (community submissions)
CREATE TABLE garden_seeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  prompt TEXT NOT NULL,
  identity_type TEXT NOT NULL DEFAULT 'anonymous' CHECK (identity_type IN ('anonymous', 'penname', 'name')),
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paymongo_session_id TEXT,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER NOT NULL,
  shipping_fee INTEGER NOT NULL DEFAULT 80,
  total INTEGER NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_province TEXT NOT NULL,
  shipping_zip TEXT,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'processing', 'packed', 'shipped', 'delivered')),
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Photographer Submissions
CREATE TABLE photo_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photographer_name TEXT NOT NULL,
  portfolio_link TEXT,
  caption TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE garden_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_submissions ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can INSERT (submit), only authenticated can read all
CREATE POLICY "Anyone can submit seeds" ON garden_seeds FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read approved seeds" ON garden_seeds FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can submit photos" ON photo_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role manages orders" ON orders FOR ALL USING (true);
