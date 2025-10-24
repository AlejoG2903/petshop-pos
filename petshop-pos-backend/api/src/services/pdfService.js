import fs from "fs";
import PDFDocument from "pdfkit";
import db from "./db.js";
import moment from "moment-timezone";

export async function generateDailyReport(date, outputPath) {
  const { rows } = await db.query(
    `SELECT s.id, s.total, s.created_at, p.name AS product_name, sp.quantity
     FROM sales s
     JOIN sale_products sp ON sp.sale_id = s.id
     JOIN products p ON p.id = sp.product_id
     WHERE DATE(s.created_at) = $1
     ORDER BY s.created_at ASC`,
    [date]
  );

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  doc.fontSize(18).text("🐾 Reporte Diario de Ventas", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Fecha: ${date}`);
  doc.moveDown();

  if (rows.length === 0) {
    doc.text("No se registraron ventas en esta fecha.");
  } else {
    rows.forEach((sale) => {
      doc.text(
        `Venta #${sale.id} - Producto: ${sale.product_name} - Cantidad: ${sale.quantity} - Total: $${sale.total}`
      );
    });
  }

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  console.log("📄 Reporte PDF generado:", outputPath);
}
