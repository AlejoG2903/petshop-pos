import { AuthService } from "../services/authService.js";

export class AuthController {
  static async login(req, res) {
    const { document, password } = req.body;

    try {
      const { token, user } = await AuthService.login(document, password);
      res.json({ token, user });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
}
