import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token requerido" });
  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    (req as any).user = decoded; // Para poder acceder como req.user
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token inválido" });
  }
}