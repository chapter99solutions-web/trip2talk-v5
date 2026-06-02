/** Approximate sunrise/sunset (local civil) from lat/lng and date. */

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function toDeg(r: number) {
  return (r * 180) / Math.PI;
}

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getSunTimes(lat: number, lng: number, date = new Date()) {
  const zenith = toRad(90.833);
  const d = dayOfYear(date);
  const lngHour = lng / 15;

  const sunrise = calc(true, d, lat, lngHour, zenith, date);
  const sunset = calc(false, d, lat, lngHour, zenith, date);

  return {
    sunrise: formatTime(sunrise, date),
    sunset: formatTime(sunset, date),
  };
}

function calc(
  isSunrise: boolean,
  day: number,
  lat: number,
  lngHour: number,
  zenith: number,
  baseDate: Date
) {
  const t = isSunrise ? 6 + lngHour - lngHour / 15 : 18 + lngHour - lngHour / 15;
  const M = 0.9856 * day - 3.289;
  let L =
    M +
    1.916 * Math.sin(toRad(M)) +
    0.02 * Math.sin(toRad(2 * M)) +
    282.634;
  L = ((L % 360) + 360) % 360;
  let RA = toDeg(Math.atan(0.91764 * Math.tan(toRad(L))));
  RA = ((RA % 360) + 360) % 360;
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = RA + (Lquadrant - RAquadrant);
  RA /= 15;
  const sinDec = 0.39782 * Math.sin(toRad(L));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH =
    (Math.cos(zenith) - sinDec * Math.sin(toRad(lat))) / (cosDec * Math.cos(toRad(lat)));
  if (cosH > 1 || cosH < -1) return null;
  let H = isSunrise ? 360 - toDeg(Math.acos(cosH)) : toDeg(Math.acos(cosH));
  H /= 15;
  const T = H + RA - 0.06571 * day - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;
  const local = new Date(baseDate);
  local.setUTCHours(0, 0, 0, 0);
  const hours = Math.floor(UT);
  const minutes = Math.round((UT - hours) * 60);
  local.setUTCHours(hours, minutes, 0, 0);
  return local;
}

function formatTime(d: Date | null, ref: Date) {
  if (!d) return '--:--';
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function daysUntilTrip(tripDate: string | null): number | null {
  if (!tripDate) return null;
  const start = new Date(tripDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((start.getTime() - now.getTime()) / 86400000);
  return diff;
}
