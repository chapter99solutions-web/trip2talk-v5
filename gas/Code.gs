const SPREADSHEET_ID = '1L1VUu0qvL0-G0C1z9byscU11kKcuMCM0iajNLjxH9eE';
const SHEET_NAME = 'Trip info';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ ok: false, reason: 'Sheet tab not found: ' + SHEET_NAME });
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const trips = rows.slice(1).filter(function (r) {
      return r[0];
    }).map(function (r) {
      const obj = {};
      headers.forEach(function (h, i) {
        obj[h] = r[i];
      });
      return obj;
    });
    return respond({
      ok: true,
      version: '1.0',
      trips: trips,
      read: { tab: SHEET_NAME, tripCount: trips.length },
    });
  } catch (err) {
    return respond({ ok: false, reason: err.message });
  }
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
