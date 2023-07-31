-- Add migration script here

-- create users table
CREATE TABLE
  users (
    id INTEGER NOT NULL PRIMARY KEY,
    pubkey TEXT NOT NULL UNIQUE,
    privkey TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create settings table
CREATE TABLE
  settings (
    id INTEGER NOT NULL PRIMARY KEY,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

-- create codes table
CREATE TABLE
  codes (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
