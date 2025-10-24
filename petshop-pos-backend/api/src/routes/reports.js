import express from "express";
import moment from "moment-timezone";
import { generateDailyReport } from "../services/pdfService.js";
import { sendReportEmail } from "../services/emailService.js";
import { reportsController } from "../controllers/reportsController.js";

const router = express.Router();

router.get("/dashboard", reportsController.getDashboardStats);

router.get("/daily-pdf", async (req, res) => {
  try {
    const date =
      req.query.date || moment().tz("America/Bogota").format("YYYY-MM-DD");
    const out = `/tmp/report-${date}.pdf`;
    await generateDailyReport(date, out);
    res.download(out);
  } catch (err) {
    console.error("❌ Error generando reporte PDF:", err);
    res.status(500).json({ message: "Error generando el PDF del reporte" });
  }
});

router.post("/email-daily", async (req, res) => {
  try {
    const date =
      req.body.date || moment().tz("America/Bogota").format("YYYY-MM-DD");
    const out = `/tmp/report-${date}.pdf`;

    await generateDailyReport(date, out);
    await sendReportEmail(
      process.env.REPORT_EMAIL_TO,
      `Reporte ventas ${date}`,
      `Adjunto reporte de ventas del ${date}`,
      out
    );

    res.json({ ok: true, path: out });
  } catch (err) {
    console.error("❌ Error enviando correo:", err);
    res.status(500).json({ message: "Error enviando el correo con el reporte" });
  }
});

export default router;
