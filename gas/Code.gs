const SPREADSHEET_ID = '1L1VUu0qvL0-G0C1z9byscU11kKcuMCM0iajNLjxH9eE';
const TRIPS_TAB = 'Trip info';
const BOOKINGS_TAB = 'Bookings';
const EXPENSES_TAB = 'Expenses';

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

var REJECTED_NAME_SNIPPETS = [
  'alpine',
  'southern coast',
  'aurora edge',
  'lavender',
  'aurora trail',
  'coastal cliffs',
  'golden fields',
  'secret southern',
];

function normalizeCode(raw) {
  return String(raw || '')
    .trim()
    .toUpperCase();
}

function isRejectedName(nameLower) {
  for (var i = 0; i < REJECTED_NAME_SNIPPETS.length; i++) {
    if (nameLower.indexOf(REJECTED_NAME_SNIPPETS[i]) !== -1) return true;
  }
  return false;
}

function extractTourCodeFromRow(obj) {
  var fields = [
    obj['Tour Code'],
    obj.tour_code,
    obj.tourCode,
    obj.TourCode,
    obj.code,
    obj['Code'],
  ];
  for (var i = 0; i < fields.length; i++) {
    var code = normalizeCode(fields[i]);
    if (ALLOWED_TOUR_CODES[code]) return code;
  }
  var blob = String(obj['Tour Name'] || obj.tourName || obj.name || obj.title || '').toUpperCase();
  var keys = Object.keys(ALLOWED_TOUR_CODES);
  for (var j = 0; j < keys.length; j++) {
    if (blob.indexOf(keys[j]) !== -1) return keys[j];
  }
  return '';
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getOrCreateSheet_(name, headers) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function readTripsFromSheet_() {
  var sheet = getSpreadsheet_().getSheetByName(TRIPS_TAB);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  var headers = rows[0];
  return rows
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
      var code = extractTourCodeFromRow(obj);
      if (!code) return false;
      obj['Tour Code'] = code;
      obj.tour_code = code;
      var nameLower = String(obj['Tour Name'] || obj.tourName || obj.name || '').toLowerCase();
      if (isRejectedName(nameLower)) {
        return false;
      }
      return true;
    });
}

function getTripsResponse_() {
  var trips = readTripsFromSheet_();
  return respond({
    ok: true,
    action: 'getTrips',
    version: '1.2',
    trips: trips,
    read: { tab: TRIPS_TAB, tripCount: trips.length },
  });
}

function addBooking_(body) {
  var sheet = getOrCreateSheet_(BOOKINGS_TAB, [
    'timestamp',
    'booking_ref',
    'tour_code',
    'name',
    'email',
    'phone',
    'seats',
    'status',
  ]);
  sheet.appendRow([
    new Date(),
    String(body.booking_ref || ''),
    normalizeCode(body.tour_code),
    String(body.name || ''),
    String(body.email || ''),
    String(body.phone || ''),
    Number(body.seats) || 1,
    String(body.status || 'confirmed'),
  ]);
  return respond({ ok: true, action: 'addBooking', booking_ref: body.booking_ref });
}

function addExpense_(body) {
  var sheet = getOrCreateSheet_(EXPENSES_TAB, [
    'timestamp',
    'tour_code',
    'description',
    'amount',
  ]);
  sheet.appendRow([
    new Date(),
    normalizeCode(body.tour_code || ''),
    String(body.description || ''),
    Number(body.amount) || 0,
  ]);
  return respond({ ok: true, action: 'addExpense' });
}

function parsePostBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return { parseError: err.message };
  }
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'getTrips';
    if (action === 'getTrips') {
      return getTripsResponse_();
    }
    return respond({ ok: false, reason: 'unknown action: ' + action });
  } catch (err) {
    return respond({ ok: false, reason: err.message });
  }
}

function doPost(e) {
  try {
    var body = parsePostBody_(e);
    var action = String(body.action || '');
    if (action === 'getTrips') {
      return getTripsResponse_();
    }
    if (action === 'addBooking') {
      return addBooking_(body);
    }
    if (action === 'addExpense') {
      return addExpense_(body);
    }
    return respond({ ok: false, reason: 'unknown action: ' + action });
  } catch (err) {
    return respond({ ok: false, reason: err.message });
  }
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
