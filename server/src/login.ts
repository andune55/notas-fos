import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

let USERS: Array<{ email: string; hash: string }> = [];
try {
  USERS = JSON.parse(process.env.USERS_JSON || "[]");
} catch (e) {
  console.error("Error parseando USERS_JSON:", e);
}
console.log("USERS:", USERS);

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  console.log("Recibido email:", email);
console.log("Usuarios disponibles:", USERS.map(u => u.email));
  const user = USERS.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Usuario no existe" });
  if (!bcrypt.compareSync(password, user.hash)) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "8h" }
  );
  res.json({ token, email });
});

export default router;