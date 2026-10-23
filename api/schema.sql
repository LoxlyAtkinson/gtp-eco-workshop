CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  input_json TEXT NOT NULL,
  report_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  scan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  notice_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  report_hash TEXT NOT NULL UNIQUE,
  delivery_status TEXT NOT NULL,
  provider_message_id TEXT,
  FOREIGN KEY(scan_id) REFERENCES scans(id)
);
CREATE INDEX IF NOT EXISTS contacts_created_idx ON contacts(created_at);
CREATE INDEX IF NOT EXISTS contacts_scan_idx ON contacts(scan_id);
CREATE TABLE IF NOT EXISTS rate_events (
  key TEXT NOT NULL,
  bucket TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(key,bucket)
);
