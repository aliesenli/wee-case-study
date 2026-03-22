import { useState, useEffect, useCallback } from "react";
import { getMyBookings } from "@/api/bookings";
import type { BookingWithFlight, BookingFilters } from "@/types";
import { Pagination } from "@/components/Pagination";
import type { PaginatedResponse } from "@/types";
import styles from "./BookingsPage.module.scss";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingsPage() {
  const [result, setResult] = useState<PaginatedResponse<BookingWithFlight> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({ page: 1 });

  const load = useCallback(async (f: BookingFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyBookings(f);
      setResult(data);
    } catch {
      setError("Buchungen konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilterChange(patch: Partial<BookingFilters>) {
    const next = { ...filters, ...patch, page: 1 };
    setFilters(next);
    load(next);
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Meine Buchungen</h1>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterField}>
          <label htmlFor="ba" className={styles.filterLabel}>Airline</label>
          <input
            id="ba"
            type="text"
            className={styles.filterInput}
            placeholder="Filter Airline"
            value={filters.airline ?? ""}
            onChange={(e) => handleFilterChange({ airline: e.target.value || undefined })}
          />
        </div>
        <div className={styles.filterField}>
          <label htmlFor="bSort" className={styles.filterLabel}>Sortierung</label>
          <select
            id="bSort"
            className={styles.filterInput}
            value={filters.sortBy ?? "booked_desc"}
            onChange={(e) =>
              handleFilterChange({ sortBy: e.target.value as BookingFilters["sortBy"] })
            }
          >
            <option value="booked_desc">Buchungsdatum (neueste)</option>
            <option value="booked_asc">Buchungsdatum (älteste)</option>
            <option value="price_asc">Preis (günstig → teuer)</option>
            <option value="price_desc">Preis (teuer → günstig)</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <span className={styles.spinner} /> Laden…
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && result && result.data.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📋</span>
          <p>Sie haben noch keine Buchungen.</p>
        </div>
      )}

      {!isLoading && result && result.data.length > 0 && (
        <>
          <div className={styles.list}>
            {result.data.map(({ booking, flight }) => (
              <article key={booking.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.flightNum}>
                    {flight.airline} {flight.flightNumber}
                  </span>
                  <span
                    className={`${styles.status} ${
                      booking.status === "confirmed"
                        ? styles.statusConfirmed
                        : styles.statusCancelled
                    }`}
                  >
                    {booking.status === "confirmed" ? "Bestätigt" : "Storniert"}
                  </span>
                </div>

                <div className={styles.route}>
                  <div className={styles.routeEndpoint}>
                    <span className={styles.routeTime}>
                      {new Date(flight.departureTime).toLocaleTimeString("de-CH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className={styles.routeCity}>{flight.origin}</span>
                  </div>
                  <span className={styles.routeArrow}>→</span>
                  <div className={styles.routeEndpoint}>
                    <span className={styles.routeTime}>
                      {new Date(flight.arrivalTime).toLocaleTimeString("de-CH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className={styles.routeCity}>{flight.destination}</span>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Passagier</span>
                    <span>{booking.passengerName}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Abflugdatum</span>
                    <span>{formatDate(flight.departureTime)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Gebucht am</span>
                    <span>{formatDate(booking.bookedAt)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Preis</span>
                    <strong className={styles.price}>
                      CHF {parseFloat(booking.totalPrice).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Pagination
            page={result.pagination.page}
            totalPages={result.pagination.totalPages}
            total={result.pagination.total}
            onPage={(p) => {
              const next = { ...filters, page: p };
              setFilters(next);
              load(next);
            }}
          />
        </>
      )}
    </main>
  );
}
