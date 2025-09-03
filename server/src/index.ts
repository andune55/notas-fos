import "dotenv/config"; // <-- Carga variables de entorno
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { randomUUID } from "node:crypto";
import { db, type ListRow, type NoteRow } from "./db.js";
import loginRouter from "./login.js";
import { authMiddleware } from "./auth-middleware.js";

import dotenv from "dotenv";
dotenv.config();


const app = express();

const ORIGIN = process.env.ORIGIN || "*";
const API_KEY = process.env.API_KEY || "";

app.use(
  cors({
    origin: ORIGIN === "*" ? true : ORIGIN,
    credentials: false
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Auth básica opcional vía API Key
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!API_KEY) return next();
  const key = req.header("X-API-Key");
  if (key && key === API_KEY) return next();
  res.status(401).json({ error: "Unauthorized" });
});

// Endpoint de login (público)
app.use("/auth", loginRouter);

// Health
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// ---- Todas las rutas protegidas: listas y notas ----
app.use(authMiddleware);

// ---- Lists ----
app.get("/lists", (_req: Request, res: Response) => {
  const rows = db
    .prepare("SELECT id, list_key, display_name, created_at FROM lists ORDER BY created_at DESC")
    .all() as ListRow[];

  const countStmt = db.prepare("SELECT COUNT(*) as count FROM notes WHERE list_key = ?");

  const data = rows.map((l: ListRow) => {
    const countRow = countStmt.get(l.list_key) as { count: number } | undefined;
    return {
      id: l.id,
      key: l.list_key,
      name: l.display_name,
      createdAt: l.created_at,
      noteCount: countRow?.count ?? 0
    };
  });

  res.json({ lists: data });
});

app.post("/lists", (req: Request, res: Response) => {
  const { key, name } = req.body as { key?: string; name?: string };
  if (!key || !name) return res.status(400).json({ error: "key and name are required" });

  try {
    const id = randomUUID();
    db.prepare("INSERT INTO lists (id, list_key, display_name) VALUES (?, ?, ?)").run(id, key, name);
    res.status(201).json({ id, key, name });
  } catch (e: any) {
    if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "List key already exists" });
    }
    res.status(500).json({ error: "Internal error" });
  }
});

app.delete("/lists/:key", (req: Request, res: Response) => {
  const key = req.params.key;
  const info = db.prepare("DELETE FROM lists WHERE list_key = ?").run(key);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

// ---- Notes ----
app.get("/lists/:key/notes", (req: Request, res: Response) => {
  const key = req.params.key;
  const rows = db
    .prepare("SELECT id, list_key, text, position, created_at, updated_at FROM notes WHERE list_key = ? ORDER BY position ASC, created_at ASC")
    .all(key) as NoteRow[];

  const notes = rows.map((n: NoteRow) => ({
    id: n.id,
    listKey: n.list_key,
    txtNota: n.text,
    position: n.position,
    createdAt: n.created_at,
    updatedAt: n.updated_at
  }));

  res.json({ notes });
});

app.post("/lists/:key/notes", (req: Request, res: Response) => {
  const key = req.params.key;
  const { text } = req.body as { text?: string };
  if (!text) return res.status(400).json({ error: "text is required" });

  const listExists = db.prepare("SELECT 1 FROM lists WHERE list_key = ?").get(key);
  if (!listExists) return res.status(404).json({ error: "List not found" });

  const nextPosRow = db.prepare("SELECT COALESCE(MAX(position), -1) AS maxPos FROM notes WHERE list_key = ?").get(key) as { maxPos: number } | undefined;
  const nextPos = ((nextPosRow?.maxPos ?? -1) + 1);

  const id = randomUUID();
  db.prepare("INSERT INTO notes (id, list_key, text, position) VALUES (?, ?, ?, ?)").run(id, key, text, nextPos);

  res.status(201).json({ id, listKey: key, txtNota: text, position: nextPos });
});

app.patch("/notes/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { text, position, listKey } = req.body as { text?: string; position?: number; listKey?: string };

  const note = db.prepare("SELECT * FROM notes WHERE id = ?").get(id) as NoteRow | undefined;
  if (!note) return res.status(404).json({ error: "Not found" });

  const newText = text ?? note.text;
  const newPos = position ?? note.position;
  const newListKey = listKey ?? note.list_key;

  const tx = db.transaction(() => {
    if (newListKey !== note.list_key) {
      db.prepare("UPDATE notes SET list_key = ? WHERE id = ?").run(newListKey, id);
    }
    db.prepare("UPDATE notes SET text = ?, position = ?, updated_at = datetime('now') WHERE id = ?")
      .run(newText, newPos, id);
  });

  tx();

  res.json({ id, listKey: newListKey, txtNota: newText, position: newPos });
});

app.delete("/notes/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const info = db.prepare("DELETE FROM notes WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

app.put("/lists/:key/notes/reorder", (req: Request, res: Response) => {
  const key = req.params.key;
  const body = req.body as { order: string[] };
  if (!Array.isArray(body.order)) return res.status(400).json({ error: "order must be an array of note ids" });

  const tx = db.transaction((ids: string[]) => {
    ids.forEach((id, index) => {
      db.prepare("UPDATE notes SET position = ?, updated_at = datetime('now') WHERE id = ? AND list_key = ?").run(index, id, key);
    });
  });

  tx(body.order);
  res.json({ ok: true });
});

app.get("/export", (_req: Request, res: Response) => {
  const lists = db.prepare("SELECT * FROM lists").all() as Array<{ id: string; list_key: string; display_name: string; created_at: string }>;
  const getNotes = db.prepare("SELECT * FROM notes WHERE list_key = ? ORDER BY position ASC");
  const data = lists.map((l) => {
    const notes = getNotes.all(l.list_key) as Array<{ id: string; list_key: string; text: string; position: number }>;
    return {
      key: l.list_key,
      name: l.display_name,
      notes: notes.map((n, idx) => ({ id: n.id, txtNota: n.text, position: typeof n.position === 'number' ? n.position : idx }))
    }
  });
  res.json({ lists: data });
});

app.post("/import", (req: Request, res: Response) => {
  const payload = req.body as { lists: Array<{ key: string; name: string; notes: Array<{ id?: string; txtNota: string; position?: number }> }> };
  if (!payload?.lists) return res.status(400).json({ error: "lists is required" });

  const tx = db.transaction(() => {
    payload.lists.forEach((l) => {
      const exists = db.prepare("SELECT 1 FROM lists WHERE list_key = ?").get(l.key);
      if (!exists) {
        const id = randomUUID();
        db.prepare("INSERT OR IGNORE INTO lists (id, list_key, display_name) VALUES (?, ?, ?)").run(id, l.key, l.name || l.key);
      } else {
        db.prepare("UPDATE lists SET display_name = ? WHERE list_key = ?").run(l.name || l.key, l.key);
      }

      db.prepare("DELETE FROM notes WHERE list_key = ?").run(l.key);

      l.notes.forEach((n, idx) => {
        const noteId = n.id || randomUUID();
        const pos = typeof n.position === 'number' ? n.position : idx;
        db.prepare("INSERT INTO notes (id, list_key, text, position) VALUES (?, ?, ?, ?)").run(noteId, l.key, n.txtNota, pos);
      });
    });
  });

  tx();
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(PORT, () => {
  console.log(`API running on :${PORT}`);
});