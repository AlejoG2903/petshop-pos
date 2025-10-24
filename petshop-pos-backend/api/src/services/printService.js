import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function printTicketToNetworkPrinter(_, sale) {
  const outputDir = path.resolve("reports", "tickets");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `ticket-${sale.id}.pdf`);
  const doc = new PDFDocument({ margin: 30 });

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("PETSHOP POS", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Venta ID: ${sale.id}`);
  doc.text(`Fecha: ${new Date(sale.date).toLocaleString("es-CO")}`);
  doc.moveDown();

  doc.text("Productos:");
  doc.moveDown(0.5);
  sale.items.forEach((item) => {
    doc.text(`${item.quantity} x ${item.name} - $${(item.price * item.quantity).toLocaleString()}`);
  });

  doc.moveDown();
  doc.text(`Total: $${Number(sale.total).toLocaleString()}`, { align: "right" });
  doc.moveDown();
  doc.text("-----------------------------", { align: "center" });
  doc.text("Gracias por tu compra ❤️", { align: "center" });

  doc.end();

  return filePath;
}
