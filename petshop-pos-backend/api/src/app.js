import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import productRoutes from "./routes/products.js";
import salesRoutes from "./routes/sales.js";
import reportsRoutes from "./routes/reports.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:4000", "http://localhost:5173", "*"],
    },
  },
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: "5mb" }));

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

export default app;
