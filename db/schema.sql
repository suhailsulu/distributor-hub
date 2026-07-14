CREATE TYPE user_status AS ENUM ('unverified', 'pending', 'active', 'inactive', 'suspended');
CREATE TYPE otp_types AS ENUM ('registration', 'password_reset');

CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    work_email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    purpose TEXT,
    user_status user_status NOT NULL DEFAULT 'pending',
    user_role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_user_status ON users(user_status);
CREATE INDEX IF NOT EXISTS idx_users_work_email ON users(work_email);

//table for registartion and password reset otps
CREATE TABLE IF NOT EXISTS otps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    otp_type otp_types NOT NULL DEFAULT 'registration',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE otps ADD COLUMN IF NOT EXISTS otp_type otp_types NOT NULL DEFAULT 'registration';

CREATE TYPE asset_type AS ENUM ('image', 'pdf', 'link', 'youtube', 'excel');

CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    asset_type asset_type NOT NULL,
    asset_url TEXT NOT NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_created_by ON assets(created_by);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at DESC);

CREATE TABLE IF NOT EXISTS folders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_common BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_folders_is_common ON folders(is_common);
CREATE INDEX IF NOT EXISTS idx_folders_created_by ON folders(created_by);

-- Maps non-common folders to companies (domains). Common folders skip this table.
CREATE TABLE IF NOT EXISTS folder_companies (
    folder_id BIGINT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (folder_id, company_id)
);

CREATE INDEX IF NOT EXISTS idx_folder_companies_company_id ON folder_companies(company_id);

-- Many-to-many: same asset can appear in multiple folders.
CREATE TABLE IF NOT EXISTS folder_assets (
    folder_id BIGINT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (folder_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_folder_assets_asset_id ON folder_assets(asset_id);
