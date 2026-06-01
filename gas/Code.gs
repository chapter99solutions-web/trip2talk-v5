const SPREADSHEET_ID = '1L1VUu0qvL0-G0C1z9byscU11kKcuMCM0iajNLjxH9eE';
const SHEET_NAME = 'Trip info';

/** Only these tour_codes may be returned — no fake / legacy packages. */
var ALLOWED_TOUR_CODES = {
  'TAS-3D2N': true,
  'MEL-4D3N': true,
  'ULU-4D3N': true,
  'NZ-6D5N': true,
  'TAS-LH-4D3N': true,
  'KIA-1DAY': true,
  'CAN-2D1N': true,
  'SYD-1DAY': true,
};

var REJECTED_NAME_MARKERS = [
  'alpine kingdom',
  'secret southern coast',
  'the aurora edge',
  'aurora edge',
  'lavender',
  'the coastal cliffs',
  'the golden fields',
];

function normalizeCode(raw) {
  return String(raw || '')
    .trim()
    .toUpperCase();
}

function rowTourCode(obj) {
  return normalizeCode(
    obj['Tour Code'] || obj.tour_code || obj.tourCode || obj.TourCode || obj.code || obj[0]
  );
}

function rowTourName(obj) {
  return String(obj['Tour Name'] || obj.tourName || obj.name || obj.title || '').toLowerCase();
}

function isRejectedName(nameLower) {
  for (var i = 0; i < REJECTED_NAME_MARKERS.length; i++) {
    if (nameLower.indexOf(REJECTED_NAME_MARKERS[i]) !== -1) return true;
  }
  return false;
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ ok: false, reason: 'Sheet tab not found: ' + SHEET_NAME });
    var rows = sheet.getDataRange().getValues();
    var headers = rows[0];
    var trips = rows
      .slice(1)
      .filter(function (r) {
        return r[0];
      })
      .map(function (r) {
        var obj = {};
        headers.forEach(function (h, i) {
          obj[h] = r[i];
        });
        return obj;
      })
      .filter(function (obj) {
        var code = rowTourCode(obj);
        if (!ALLOWED_TOUR_CODES[code]) return false;
        if (isRejectedName(rowTourName(obj))) return false;
        return true;
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
