import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export async function generateReceiptPDF(
  vendorName: string,
  customerName: string,
  vehicleNo: string,
  amount: number,
  approvalCode: string,
  date: Date
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  // Title
  page.drawText("ASLON VENDOR PORTAL - RECEIPT", {
    x: margin,
    y,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // QR Code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(approvalCode, { type: "image/png" });
    // Convert data URL to Uint8Array
    const base64Data = qrCodeDataUrl.split(",")[1];
    const qrImageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    const qrSize = 100;
    page.drawImage(qrImage, {
      x: width - margin - qrSize,
      y: y - qrSize,
      width: qrSize,
      height: qrSize,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  // Receipt Details
  y -= 30;
  page.drawText("Receipt Details", {
    x: margin,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  const details = [
    { label: "Vendor Name:", value: vendorName },
    { label: "Customer Name:", value: customerName },
    { label: "Vehicle Number:", value: vehicleNo },
    { label: "Amount:", value: `$${amount.toFixed(2)}` },
    { label: "Date:", value: date.toLocaleDateString() },
    { label: "Time:", value: date.toLocaleTimeString() },
    { label: "Approval Code:", value: approvalCode },
  ];

  details.forEach((detail) => {
    page.drawText(detail.label, {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(detail.value, {
      x: margin + 150,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 25;
  });

  y -= 20;
  page.drawText("Thank you for your business!", {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

