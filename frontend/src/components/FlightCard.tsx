import type { Flight } from "@/types";
import styles from "./FlightCard.module.scss";

interface Props {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" }),
  };
}

function calcDuration(dep: string, arr: string) {
  const diff = new Date(arr).getTime() - new Date(dep).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.round((diff % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

export function FlightCard({ flight, onBook }: Props) {
  const dep = formatDateTime(flight.departureTime);
  const arr = formatDateTime(flight.arrivalTime);
  const duration = calcDuration(flight.departureTime, flight.arrivalTime);
  const available = flight.availableTickets > 0;

  return (
    <article className={styles.card}>
      <div className={styles.airline}>
        <span className={styles.airlineName}>{flight.airline}</span>
        <span className={styles.flightNumber}>{flight.flightNumber}</span>
      </div>

      <div className={styles.route}>
        <div className={styles.endpoint}>
          <span className={styles.time}>{dep.time}</span>
          <span className={styles.city}>{flight.origin}</span>
          <span className={styles.dateLabel}>{dep.date}</span>
        </div>

        <div className={styles.durationBlock}>
          <span className={styles.duration}>{duration}</span>
          <div className={styles.line}>
            <span className={styles.dot} />
            <span className={styles.dash} />
            <span className={styles.plane}>✈</span>
          </div>
          <span className={styles.direct}>Nonstop</span>
        </div>

        <div className={`${styles.endpoint} ${styles.endpointRight}`}>
          <span className={styles.time}>{arr.time}</span>
          <span className={styles.city}>{flight.destination}</span>
          <span className={styles.dateLabel}>{arr.date}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.ticketInfo}>
          {available ? (
            <span className={styles.available}>
              {flight.availableTickets} Plätze verfügbar
            </span>
          ) : (
            <span className={styles.soldOut}>Ausgebucht</span>
          )}
        </div>

        <div className={styles.priceBlock}>
          <span className={styles.price}>
            CHF {parseFloat(flight.price).toFixed(2)}
          </span>
          <button
            className={styles.bookBtn}
            onClick={() => onBook(flight)}
            disabled={!available}
          >
            {available ? "Buchen" : "Nicht verfügbar"}
          </button>
        </div>
      </div>
    </article>
  );
}
