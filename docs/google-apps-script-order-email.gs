const NOTIFICATION_EMAIL = 'Ahmednabilpress@gmail.com';
const SHEET_NAME = 'Orders';

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: 'doPost must be called by the deployed web app with a POST request.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let data = {};
  try {
    data = JSON.parse(e.postData.contents || '{}');
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: 'Invalid JSON payload.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getOrdersSheet_();
  const submittedAt = data.submittedAt || new Date().toISOString();
  let emailStatus = 'sent';
  let emailError = '';

  sheet.appendRow([
    data.orderId || '',
    submittedAt,
    data.name || '',
    data.phone || '',
    data.address || '',
    data.pieces || '',
    data.originalPrice || '',
    data.discount || '',
    data.finalPrice || '',
    ''
  ]);

  try {
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: `New Juzur order - ${data.name || 'Customer'} - ${data.orderId || ''}`,
      body: buildOrderText_(data, submittedAt),
      htmlBody: buildOrderEmail_(data, submittedAt)
    });
  } catch (error) {
    emailStatus = 'failed';
    emailError = error && error.message ? error.message : String(error);
  }

  const row = sheet.getLastRow();
  sheet.getRange(row, 10).setValue(emailStatus);

  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      emailStatus: emailStatus,
      emailError: emailError
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: 'Juzur order endpoint is live.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrdersSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Order ID',
      'Submitted At',
      'Name',
      'Phone',
      'Address',
      'Pieces',
      'Original Price',
      'Discount',
      'Final Price',
      'Email Status'
    ]);
  }

  return sheet;
}

function buildOrderEmail_(data, submittedAt) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#173024">
      <h2 style="margin:0 0 12px">New Juzur order</h2>
      <p><strong>Order ID:</strong> ${escapeHtml_(data.orderId || '')}</p>
      <p><strong>Name:</strong> ${escapeHtml_(data.name || '')}</p>
      <p><strong>Phone:</strong> ${escapeHtml_(data.phone || '')}</p>
      <p><strong>Address:</strong> ${escapeHtml_(data.address || '')}</p>
      <p><strong>Pieces:</strong> ${escapeHtml_(data.pieces || '')}</p>
      <p><strong>Original Price:</strong> ${escapeHtml_(data.originalPrice || '')}</p>
      <p><strong>Discount:</strong> ${escapeHtml_(data.discount || '')}</p>
      <p><strong>Final Price:</strong> ${escapeHtml_(data.finalPrice || '')}</p>
      <p><strong>Submitted:</strong> ${escapeHtml_(submittedAt)}</p>
    </div>
  `;
}

function buildOrderText_(data, submittedAt) {
  return [
    'New Juzur order',
    `Order ID: ${data.orderId || ''}`,
    `Name: ${data.name || ''}`,
    `Phone: ${data.phone || ''}`,
    `Address: ${data.address || ''}`,
    `Pieces: ${data.pieces || ''}`,
    `Original Price: ${data.originalPrice || ''}`,
    `Discount: ${data.discount || ''}`,
    `Final Price: ${data.finalPrice || ''}`,
    `Submitted: ${submittedAt}`
  ].join('\n');
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
