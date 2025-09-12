import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "notes.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// MIGRACIÓN: Añadir columna usuario si no existe
const listColumns = db.prepare(`PRAGMA table_info(lists)`).all();
if (!listColumns.find(c => c.name === "usuario")) {
  db.exec(`ALTER TABLE lists ADD COLUMN usuario TEXT`);
  db.exec(`UPDATE lists SET usuario = 'admin' WHERE usuario IS NULL`);
}
const noteColumns = db.prepare(`PRAGMA table_info(notes)`).all();
if (!noteColumns.find(c => c.name === "usuario")) {
  db.exec(`ALTER TABLE notes ADD COLUMN usuario TEXT`);
  db.exec(`UPDATE notes SET usuario = 'admin' WHERE usuario IS NULL`);
}

// ELIMINA UNIQUE DE list_key SI EXISTE Y CREA UNICIDAD COMPUESTA
try {
  db.exec(`DROP INDEX IF EXISTS idx_lists_list_key`);
} catch {}
db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_lists_usuario_key ON lists(usuario, list_key);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_notes_list_key_usuario ON notes(list_key, usuario);`);

// Esquema final (por si creas la DB desde cero)
db.exec(`
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  list_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  usuario TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  list_key TEXT NOT NULL,
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  usuario TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export type ListRow = {
  id: string;
  list_key: string;
  display_name: string;
  usuario: string;
  created_at: string;
};

export type NoteRow = {
  id: string;
  list_key: string;
  text: string;
  position: number;
  usuario: string;
  created_at: string;
  updated_at: string;
};