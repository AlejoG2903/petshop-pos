import express from "express";
import { AuthController } from "../controllers/authController.js";

const router = express.Router();

// Ruta de inicio de sesión por número de documento
router.post("/login", AuthController.login);

export default router;
