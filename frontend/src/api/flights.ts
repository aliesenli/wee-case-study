import type {
  Flight,
  FlightFilters,
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

export async function getFlights(
  filters: FlightFilters = {}
): Promise<PaginatedResponse<Flight>> {
  const res = await fetch(`${BASE}/flights${buildQuery(filters as Record<string, unknown>)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getFlightById(id: string): Promise<Flight> {
  const res = await fetch(`${BASE}/flights/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
