import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "notes.db");

// Asegura carpeta
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Esquema
db.exec(`
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  list_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  list_key TEXT NOT NULL REFERENCES lists(list_key) ON DELETE CASCADE,
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_list_key ON notes(list_key);
CREATE INDEX IF NOT EXISTS idx_notes_position ON notes(position);
`);

export type ListRow = {
  id: string;
  list_key: string;
  display_name: string;
  created_at: string;
};

export type NoteRow = {
  id: string;
  list_key: string;
  text: string;
  position: number;
  created_at: string;
  updated_at: string;
};