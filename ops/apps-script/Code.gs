const PROPERTY_KEYS = {
  spreadsheetId: 'SPREADSHEET_ID',
  sheetName: 'ORDERS_SHEET_NAME',
  notificationEmail: 'NOTIFICATION_EMAIL'
};

function jsonOutput_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorOutput_(message) {
  return jsonOutput_({ ok: false, error: message });
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return errorOutput_('A POST request with a JSON body is required.');
  }

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return errorOutput_('Invalid JSON payload.');
  }

  const validation = validateOrder_(data);
  if (!validation.ok) return errorOutput_(validation.error);

  try {
    const config = getConfig_();
    const sheet = getOrdersSheet_(config);
    const orderId = String(data.orderId).trim();
    const submittedAt = data.submissionTimestamp || data.submittedAt || new Date().toISOString();

    if (findOrderRow_(sheet, orderId)) {
      return errorOutput_('An order with this orderId already exists.');
    }

    const originalUnitPrice = Number(data.listUnitPrice) || 2500;
    const originalPrice = originalUnitPrice * validation.quantity;
    const discount = originalPrice - validation.subtotal;
    const address = [
      data.detailedAddress || data.address || '',
      data.areaCity || '',
      data.governorate || '',
      data.landmark || ''
    ].filter(Boolean).join(', ');

    sheet.appendRow([
      orderId,
      submittedAt,
      data.fullName || data.name || '',
      data.phone || '',
      address,
      validation.quantity,
      originalPrice,
      discount,
      validation.subtotal,
      'Website order'
    ]);

    SpreadsheetApp.flush();
    let emailStatus = 'not-configured';

    if (config.notificationEmail) {
      try {
        MailApp.sendEmail({
          to: config.notificationEmail,
          subject: `New Juzur order - ${data.fullName || data.name || 'Customer'} - ${orderId}`,
          body: buildOrderText_(data, validation, submittedAt)
        });
        emailStatus = 'sent';
      } catch (error) {
        emailStatus = 'failed';
      }
    }

    return jsonOutput_({ ok: true, orderId: orderId, emailStatus: emailStatus });
  } catch (error) {
    return errorOutput_(error && error.message ? error.message : 'The order could not be saved.');
  }
}

function doGet() {
  return jsonOutput_({ ok: true, message: 'Juzur order endpoint is live.' });
}

function validateOrder_(data) {
  const orderId = String(data.orderId || '').trim();
  const quantity = Number(data.quantity);
  const unitPrice = Number(data.unitPrice);
  const expectedSubtotal = unitPrice * quantity;
  const hasSubtotal = data.subtotal !== undefined && data.subtotal !== null && data.subtotal !== '';
  const subtotal = hasSubtotal ? Number(data.subtotal) : expectedSubtotal;

  if (!orderId) return { ok: false, error: 'orderId is required.' };
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, error: 'quantity must be a positive integer.' };
  }
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    return { ok: false, error: 'unitPrice must be a valid positive number.' };
  }
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return { ok: false, error: 'subtotal must be a valid positive number.' };
  }
  if (subtotal !== expectedSubtotal) {
    return { ok: false, error: 'subtotal does not match unitPrice multiplied by quantity.' };
  }

  return { ok: true, quantity: quantity, unitPrice: unitPrice, subtotal: subtotal };
}

function getConfig_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty(PROPERTY_KEYS.spreadsheetId);
  const sheetName = properties.getProperty(PROPERTY_KEYS.sheetName);

  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not configured.');
  if (!sheetName) throw new Error('ORDERS_SHEET_NAME is not configured.');

  return {
    spreadsheetId: spreadsheetId,
    sheetName: sheetName,
    notificationEmail: properties.getProperty(PROPERTY_KEYS.notificationEmail) || ''
  };
}

function getOrdersSheet_(config) {
  const spreadsheet = SpreadsheetApp.openById(config.spreadsheetId);
  let sheet = spreadsheet.getSheetByName(config.sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(config.sheetName);
    sheet.getRange('A1:J1').setValues([[
      'Order ID',
      'Submitted At',
      'Customer Name',
      'Phone',
      'Address',
      'Units',
      'Original Price',
      'Discount',
      'Final Price',
      'Website / WhatsApp Status'
    ]]);
  }

  return sheet;
}

function findOrderRow_(sheet, orderId) {
  if (sheet.getLastRow() < 2) return null;
  return sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(orderId)
    .matchEntireCell(true)
    .findNext();
}

function buildOrderText_(data, order, submittedAt) {
  return [
    'New Juzur order',
    `Order ID: ${data.orderId || ''}`,
    `Name: ${data.fullName || data.name || ''}`,
    `Phone: ${data.phone || ''}`,
    `Governorate: ${data.governorate || ''}`,
    `Area / City: ${data.areaCity || ''}`,
    `Address: ${data.detailedAddress || data.address || ''}`,
    `Landmark: ${data.landmark || ''}`,
    `Quantity: ${order.quantity}`,
    `Unit Price: ${order.unitPrice}`,
    `Subtotal: ${order.subtotal}`,
    `Submitted: ${submittedAt}`
  ].join('\n');
}
