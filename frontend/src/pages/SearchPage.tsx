import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getFlights } from "@/api/flights";
import { useAuth } from "@/contexts/AuthContext";
import type { Flight, FlightFilters, PaginatedResponse } from "@/types";
import { SearchForm } from "@/components/SearchForm";
import { FlightCard } from "@/components/FlightCard";
import { Pagination } from "@/components/Pagination";
import { BookingModal } from "@/components/BookingModal";
import { BookingSuccessModal } from "@/components/BookingSuccessModal";
import styles from "./SearchPage.module.scss";

export function SearchPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [result, setResult] = useState<PaginatedResponse<Flight> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FlightFilters>({});
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const search = useCallback(async (f: FlightFilters) => {
    setFilters(f);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFlights(f);
      setResult(data);
    } catch {
      setError("Fehler beim Laden der Flüge. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleBook(flight: Flight) {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedFlight(flight);
  }

  function handleBookingSuccess() {
    setSelectedFlight(null);
    setShowSuccess(true);
    // Refresh results to reflect updated ticket count
    search(filters);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Flüge suchen & buchen</h1>
        <p className={styles.heroSub}>
          Filtern Sie nach Ziel, Datum, Airline und Preis.
        </p>
      </section>

      <section className={styles.searchSection}>
        <SearchForm
          initialFilters={filters}
          onSearch={search}
          isLoading={isLoading}
        />
      </section>

      <section className={styles.results}>
        {isLoading && (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            Suche läuft…
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!isLoading && result && result.data.length === 0 && (
          <p className={styles.empty}>
            Keine Flüge gefunden. Bitte passen Sie die Suchkriterien an.
          </p>
        )}

        {!isLoading && result && result.data.length > 0 && (
          <>
            <div className={styles.list}>
              {result.data.map((flight) => (
                <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
              ))}
            </div>

            <Pagination
              page={result.pagination.page}
              totalPages={result.pagination.totalPages}
              total={result.pagination.total}
              onPage={(p) => search({ ...filters, page: p })}
            />
          </>
        )}

        {!isLoading && result === null && (
          <div className={styles.hint}>
            <span className={styles.hintIcon}>✈</span>
            <p>Starten Sie eine Suche, um verfügbare Flüge zu sehen.</p>
          </div>
        )}
      </section>

      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showSuccess && (
        <BookingSuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </main>
  );
}
