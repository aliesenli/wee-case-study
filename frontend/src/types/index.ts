export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  session: {
    id: string;
    token: string;
    expiresAt: string;
    userId: string;
  };
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  availableTickets: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  cardLastFour: string;
  cardHolder: string;
  method: "credit_card" | "debit_card";
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  status: "confirmed" | "cancelled";
  passengerName: string;
  passengerEmail: string;
  paymentDetails?: PaymentDetails | null;
  totalPrice: string;
  bookedAt: string;
  updatedAt: string;
}

export interface BookingWithFlight {
  booking: Booking;
  flight: Flight;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FlightFilters {
  origin?: string;
  destination?: string;
  date?: string;
  airline?: string;
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  sortBy?: "price_asc" | "price_desc" | "departure_asc" | "departure_desc";
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  airline?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "booked_asc" | "booked_desc" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}

export interface CreateBookingInput {
  flightId: string;
  passengerName: string;
  passengerEmail: string;
  paymentDetails?: {
    cardLastFour: string;
    cardHolder: string;
    method: "credit_card" | "debit_card";
  };
}
