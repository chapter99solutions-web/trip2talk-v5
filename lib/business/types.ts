export type ReviewRow = {
  id: string;
  booking_ref: string | null;
  tour_code: string;
  guest_name: string;
  rating: number | null;
  review_text: string | null;
  photo_url: string | null;
  is_published: boolean;
  created_at?: string;
};

export type MonthlyReportRow = {
  id: string;
  year: number;
  month: number;
  total_revenue_aud: number;
  total_expenses_aud: number;
  net_profit_aud: number;
  total_bookings: number;
  total_guests: number;
  repeat_customers: number;
  top_tour_code: string | null;
  notes: string | null;
  generated_at?: string;
};

export type BusinessAssetRow = {
  id: string;
  asset_type: string;
  asset_name: string;
  description: string | null;
  estimated_value_aud: number | null;
  purchase_date: string | null;
  expiry_date: string | null;
  login_hint: string | null;
  notes: string | null;
  created_at?: string;
};

export type SopDocumentRow = {
  id: string;
  category: string;
  title: string;
  content: string;
  version: string;
  last_updated?: string;
};

export type CustomerStatRow = {
  email: string;
  total_bookings: number;
  total_seats: number;
  tours_taken: string[] | null;
  first_booking: string;
  last_booking: string;
};

export type MonthChartPoint = {
  label: string;
  year: number;
  month: number;
  revenue: number;
  expenses: number;
};

export type TripFinanceRow = {
  tour_code: string;
  guests: number;
  revenue: number;
  expenses: number;
  profit: number;
};

export type PendingPaymentRow = {
  id: string;
  name: string;
  tour_code: string;
  amount_remaining: number;
  days_until_trip: number | null;
  payment_status: string;
};

export type FinanceDashboardData = {
  currentMonth: string;
  overview: {
    revenue: number;
    expenses: number;
    profit: number;
    totalGuests: number;
    repeatCustomers: number;
  };
  chart: MonthChartPoint[];
  byTrip: TripFinanceRow[];
  pending: PendingPaymentRow[];
};

export type BusinessPassportMetrics = {
  totalTripsConducted: number;
  totalGuestsServed: number;
  repeatCustomerRate: number;
  averageRating: number;
  totalReviews: number;
  activeTripProducts: number;
  revenueThisYear: number;
};
