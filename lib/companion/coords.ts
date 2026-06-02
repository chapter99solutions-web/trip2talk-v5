/** Lat/lng per tour_code for golden hour calculations. */
export const TOUR_COORDS: Record<string, { lat: number; lng: number; city: string }> = {
  'MEL-4D3N': { lat: -37.8136, lng: 144.9631, city: 'Melbourne' },
  'ULU-4D3N': { lat: -25.3444, lng: 131.0369, city: 'Uluru' },
  'NZ-6D5N': { lat: -43.532, lng: 172.6362, city: 'Christchurch' },
  'TAS-3D2N': { lat: -42.8821, lng: 147.3272, city: 'Hobart' },
  'TAS-LH-4D3N': { lat: -41.4332, lng: 147.1441, city: 'Launceston' },
  'KIA-1DAY': { lat: -34.6709, lng: 150.8543, city: 'Kiama' },
  'CAN-2D1N': { lat: -33.8354, lng: 148.9821, city: 'Cowra' },
  'SYD-1DAY': { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
  'PSP-1DAY': { lat: -32.715, lng: 152.1519, city: 'Port Stephens' },
  'SYD-MW-WIN': { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
  'LAV-ANB-1D': { lat: -32.75, lng: 152.1, city: 'Anna Bay' },
  'TAS-SU-4D3N': { lat: -42.8821, lng: 147.3272, city: 'Tasmania' },
  'BER-3D2N': { lat: -36.4244, lng: 150.0645, city: 'Bermagui' },
};

export function getCoordsForTour(tourCode: string) {
  return TOUR_COORDS[tourCode.toUpperCase()] ?? TOUR_COORDS['SYD-1DAY'];
}
