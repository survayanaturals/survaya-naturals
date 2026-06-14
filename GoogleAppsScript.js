// ============================================================
// SURVAYA NATURALS — Google Apps Script
// ============================================================
// HOW TO SET UP (5 minutes):
//
// 1. Go to sheets.google.com → Create new sheet
// 2. Name it "Survaya Orders"
// 3. Add these headers in Row 1:
//    A: OrderID | B: Date | C: CustomerName | D: Phone
//    E: Address | F: City | G: State | H: Pincode
//    I: Items | J: Total | K: PaymentStatus | L: Status | M: Notes
//
// 4. Click Extensions → Apps Script
// 5. Delete existing code → Paste ALL this code
// 6. Click Save → Click Deploy → New Deployment
// 7. Type: Web App
// 8. Execute as: Me
// 9. Who has access: Anyone
// 10. Click Deploy → Copy the Web App URL
// 11. Paste that URL in your frontend .env as VITE_SHEET_API_URL
// ============================================================

const SHEET_NAME = "Survaya Orders";

// Generate unique Order ID
function generateOrderId() {
  const now = new Date();
  const date = Utilities.formatDate(now, "Asia/Kolkata", "yyMMdd");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SN${date}${rand}`;
}

// Handle POST — Save new order
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    const orderId = generateOrderId();
    const now = Utilities.formatDate(
      new Date(),
      "Asia/Kolkata",
      "dd-MM-yyyy HH:mm",
    );

    // Append row to sheet
    sheet.appendRow([
      orderId, // A: OrderID
      now, // B: Date
      data.customer.name, // C: CustomerName
      data.customer.phone, // D: Phone
      data.address.street, // E: Address
      data.address.city, // F: City
      data.address.state, // G: State
      data.address.pincode, // H: Pincode
      data.itemsSummary, // I: Items
      data.total, // J: Total
      "Order Received", // K: PaymentStatus
      "Order Received", // L: Status
      "", // M: Notes
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, orderId }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET — Track order by ID
function doGet(e) {
  try {
    const orderId = e.parameter.orderId;
    if (!orderId) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "No orderId provided" }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    // Search for order (skip header row)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === orderId) {
        const order = {
          orderId: data[i][0],
          date: data[i][1],
          customerName: data[i][2],
          phone: data[i][3],
          address: `${data[i][4]}, ${data[i][5]}, ${data[i][6]} - ${data[i][7]}`,
          items: data[i][8],
          total: data[i][9],
          paymentStatus: data[i][10],
          status: data[i][11],
          notes: data[i][12],
        };
        return ContentService.createTextOutput(
          JSON.stringify({ success: true, data: order }),
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: "Order not found" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
