import type {
  BookingWithFlight,
  BookingFilters,
  CreateBookingInput,
  PaginatedResponse,
} from "@/types";

const BASE = "/api";

function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) {
      q.set(k, String(v));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function getMyBookings(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<BookingWithFlight>> {
  const res = await fetch(
    `${BASE}/bookings${buildQuery(filters as Record<string, unknown>)}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createBooking(
  input: CreateBookingInput
): Promise<{ booking: BookingWithFlight["booking"]; flight: BookingWithFlight["flight"] }> {
  const res = await fetch(`${BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "Failed to create booking");
  }
  return res.json();
}

export async function getBookingById(
  id: string
): Promise<BookingWithFlight> {
  const res = await fetch(`${BASE}/bookings/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
