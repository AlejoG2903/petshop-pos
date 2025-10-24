import express from "express";
import { salesController } from "../controllers/salesController.js";

const router = express.Router();

router.post("/", salesController.createSale);
router.get("/", salesController.listSales);
router.get("/history", salesController.getSalesHistory);
router.post("/print", salesController.printSale);

export default router;
