import jwt from "jsonwebtoken";
import db from "./db.js";

export class AuthService {
  static async login(document, password) {
    // Buscar usuario por documento
    const result = await db.query("SELECT * FROM users WHERE document = $1", [document]);
    const user = result.rows[0];

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Comparar directamente contraseñas (sin hash)
    if (user.password !== password) {
      throw new Error("Contraseña incorrecta");
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return { token, user };
  }
}
