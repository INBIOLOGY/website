-- ─────────────────────────────────────────────────────────────────────────────
-- INBIOLOGY ACADEMY — PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ─────────────────────────────────────────────────────────────────────────────
-- Architecture:
-- 1. users: Main table storing personal profiles, education, contacts, and credentials.
-- 2. email_verifications: Temporary store for in-page 6-digit OTP verification.
-- 3. oauth_accounts: 3rd-party OAuth providers (Google, LINE, etc.) for Account Linking.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. TABLE: email_verifications (In-page 6-digit Email OTP Verification)
-- =============================================================================
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,                 -- Store hashed 6-digit OTP (e.g. SHA-256 or bcrypt)
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,    -- OTP valid for 5 minutes
    attempts INT DEFAULT 0,                          -- Rate limit: max 5 failed attempts per OTP
    is_verified BOOLEAN DEFAULT FALSE,               -- Set to true upon successful OTP check
    verification_token VARCHAR(255),                 -- One-time token used to submit the registration form
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fast lookup indexes for OTP queries
CREATE INDEX IF NOT EXISTS idx_email_verifications_lookup 
    ON email_verifications (LOWER(email), is_verified, expires_at);

-- =============================================================================
-- 2. TABLE: users (Core User & Student Profile)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Login Credentials
    username VARCHAR(50) UNIQUE,                     -- Optional Username
    email VARCHAR(255) UNIQUE NOT NULL,              -- Email (case-insensitive indexed)
    password_hash VARCHAR(255),                      -- Nullable if signed up strictly via Google
    email_verified_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp when email OTP was verified
    
    -- Personal Information
    full_name VARCHAR(100) NOT NULL,                 -- ชื่อ - นามสกุลจริง
    nickname VARCHAR(50) NOT NULL,                  -- ชื่อเล่น
    birthdate DATE NOT NULL,                         -- วันเกิด
    age INT DEFAULT 0,                               -- อายุ (คำนวณอัตโนมัติจากวันเกิดผ่าน Trigger ด้านล่าง)
    phone_number VARCHAR(20) NOT NULL,               -- เบอร์โทรศัพท์ติดต่อ (ใช้เข้าสู่ระบบได้)
    
    -- Education Information
    school VARCHAR(150) NOT NULL,                    -- โรงเรียน
    grade_level VARCHAR(50) NOT NULL,                -- ระดับชั้น (ม.4, ม.5, ม.6, เด็กซิ่ว, สอวน.)
    
    -- Social Media Contacts (Optional)
    instagram VARCHAR(50),                           -- Instagram handle e.g. @username
    line_id VARCHAR(50),                             -- LINE ID
    facebook VARCHAR(150),                           -- Facebook profile name or URL
    
    -- System & Status
    role VARCHAR(20) DEFAULT 'student',              -- 'student' | 'admin' | 'instructor'
    avatar_url TEXT,                                 -- Profile image URL
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Case-insensitive indexes for lightning fast login queries
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone_number);

-- Trigger to automatically calculate age whenever birthdate is inserted or updated
CREATE OR REPLACE FUNCTION set_user_age()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.birthdate IS NOT NULL THEN
        NEW.age := DATE_PART('year', AGE(CURRENT_DATE, NEW.birthdate));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_user_age ON users;
CREATE TRIGGER trigger_set_user_age
BEFORE INSERT OR UPDATE OF birthdate ON users
FOR EACH ROW
EXECUTE FUNCTION set_user_age();

-- =============================================================================
-- 3. TABLE: oauth_accounts (Account Linking for Google & 3rd-party OAuth)
-- =============================================================================
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,                   -- e.g. 'google', 'line'
    provider_user_id VARCHAR(255) NOT NULL,          -- Google 'sub' (Unique User ID)
    provider_email VARCHAR(255),                     -- Email associated with the provider
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one Google ID cannot be linked to multiple accounts
    CONSTRAINT uq_provider_account UNIQUE (provider, provider_user_id),
    -- Ensure a user can link at most one account per provider
    CONSTRAINT uq_user_provider UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_oauth_accounts_lookup 
    ON oauth_accounts (provider, provider_user_id);

-- =============================================================================
-- 4. TABLE: orders (Payment Orders with Slip Verification)
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Who is paying
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255) NOT NULL,           -- Snapshot of email at order time
    user_name VARCHAR(100),                     -- Snapshot of student name

    -- What they bought
    course_ids TEXT[] NOT NULL,                 -- Array of course IDs e.g. {'bio-intensive-1','bio-intensive-2'}
    course_titles TEXT,                         -- Human-readable course names (comma-separated)
    total_amount NUMERIC(10, 2) NOT NULL,       -- Final amount after coupon
    coupon_code VARCHAR(50),                    -- Coupon used (if any)
    discount_amount NUMERIC(10, 2) DEFAULT 0,

    -- Payment Evidence
    slip_image TEXT,                            -- Base64 encoded image or Supabase Storage URL

    -- Status Lifecycle: pending → approved | rejected
    status VARCHAR(20) DEFAULT 'pending',       -- 'pending' | 'approved' | 'rejected'
    admin_note TEXT,                            -- Admin's reason for rejection (optional)
    reviewed_by VARCHAR(100),                   -- Admin name who approved/rejected
    approved_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders (LOWER(user_email));
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

-- =============================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES FOR INBIOLOGY CLIENT
-- =============================================================================
-- To allow the web frontend (using the anon/publishable key) to register students,
-- verify email OTPs, and link OAuth accounts, run this section:

-- OPTION A: Disable RLS completely (Simplest for direct frontend access)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- OPTION B: Or enable RLS with permissive policies for anon & authenticated roles:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.oauth_accounts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon insert users" ON public.users FOR INSERT TO anon, authenticated WITH CHECK (true);
-- CREATE POLICY "Allow anon select users" ON public.users FOR SELECT TO anon, authenticated USING (true);
-- CREATE POLICY "Allow anon update users" ON public.users FOR UPDATE TO anon, authenticated USING (true);
-- CREATE POLICY "Allow anon insert email_verifications" ON public.email_verifications FOR INSERT TO anon, authenticated WITH CHECK (true);
-- CREATE POLICY "Allow anon select email_verifications" ON public.email_verifications FOR SELECT TO anon, authenticated USING (true);
-- CREATE POLICY "Allow anon update email_verifications" ON public.email_verifications FOR UPDATE TO anon, authenticated USING (true);
-- CREATE POLICY "Allow anon all oauth_accounts" ON public.oauth_accounts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
-- CREATE POLICY "Allow anon select orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
-- CREATE POLICY "Allow anon update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true);

-- =============================================================================
-- 6. TABLE: site_content (Cross-Device Course & Lesson CMS Synchronization)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_content (
    key VARCHAR(100) PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 7. DATA API GRANTS (PostgreSQL Permissions for Supabase PostgREST Data API)
-- =============================================================================
-- Supabase Oct 30 Security Requirement: Explicit grants for public tables
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure future tables also inherit these permissions automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


