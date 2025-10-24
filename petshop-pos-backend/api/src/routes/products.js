import express from "express";
import db from "../services/db.js";
import { productsController } from "../controllers/productsController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", productsController.getProducts);

router.post("/", upload.single('image'), productsController.createProduct);

router.put("/:id", upload.single('image'), productsController.updateProduct);

router.delete("/:id", productsController.deleteProduct);

export default router;
