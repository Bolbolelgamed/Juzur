import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { product } from '../src/config/product.js';
import { createOrderPayload } from '../src/utils/order.js';

const code = await readFile(new URL('../ops/apps-script/Code.gs', import.meta.url), 'utf8');

function order(governorate = 'Cairo') {
  return createOrderPayload({
    form: { fullName: 'Test Customer', phone: '01012345678', governorate, areaCity: 'Test City', detailedAddress: '1 Test Street', landmark: '' },
    language: 'en', quantity: 2, product,
  });
}

for (const governorate of ['Cairo', 'Giza', 'Alexandria']) {
  test(`Apps Script records the full ${governorate} total and notifies with a shipping breakdown`, () => {
    const payload = order(governorate);
    const shippingFee = governorate === 'Alexandria' ? 75 : 50;
    let savedRow;
    let email;
    const context = vm.createContext({
      ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }) },
      PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => ({ SPREADSHEET_ID: 'test-sheet', ORDERS_SHEET_NAME: 'Orders', NOTIFICATION_EMAIL: 'owner@example.test' }[key]) }) },
      SpreadsheetApp: { openById: () => ({ getSheetByName: () => ({ getLastRow: () => 1, appendRow: (row) => { savedRow = Array.from(row); } }) }), flush: () => {} },
      MailApp: { sendEmail: (message) => { email = message; } },
    });
    vm.runInContext(code, context);
    const result = context.doPost({ postData: { contents: JSON.stringify(payload) } });
    assert.equal(result.ok, true);
    assert.equal(savedRow[8], 4000 + shippingFee);
    assert.match(email.body, /Subtotal: 4000/);
    assert.match(email.body, new RegExp(`Shipping: ${shippingFee}`));
    assert.match(email.body, new RegExp(`Total including shipping: ${4000 + shippingFee}`));
  });
}

test('Apps Script rejects inconsistent shipping charges or totals', () => {
  const context = vm.createContext({});
  vm.runInContext(code, context);
  assert.equal(context.validateOrder_({ ...order(), shippingFee: 75 }).ok, false);
  assert.equal(context.validateOrder_({ ...order(), total: 4000 }).ok, false);
});
