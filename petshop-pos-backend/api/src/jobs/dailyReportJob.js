import cron from "node-cron";
import moment from "moment-timezone";
import { generateDailyReport } from "../services/pdfService.js";
import { sendReportEmail } from "../services/emailService.js";

export function scheduleDailyReport() {
  cron.schedule(
    "0 23 * * *",
    async () => {
      try {
        const date = moment().tz("America/Bogota").format("YYYY-MM-DD");
        const out = `/tmp/report-${date}.pdf`;

        await generateDailyReport(date, out);
        await sendReportEmail(
          process.env.REPORT_EMAIL_TO,
          `Reporte ventas ${date}`,
          `Adjunto reporte de ventas del ${date}`,
          out
        );

        console.log("✅ Reporte diario generado y enviado:", date);
      } catch (err) {
        console.error("❌ Error en job reporte diario:", err);
      }
    },
    { timezone: "America/Bogota" }
  );
}
