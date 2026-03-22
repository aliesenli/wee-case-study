import { useState, type FormEvent } from "react";
import type { Flight, CreateBookingInput } from "@/types";
import { createBooking } from "@/api/bookings";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./BookingModal.module.scss";

interface Props {
  flight: Flight | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ flight, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState<"passenger" | "payment" | "confirm">(
    "passenger"
  );
  const [passengerName, setPassengerName] = useState(user?.name ?? "");
  const [passengerEmail, setPassengerEmail] = useState(user?.email ?? "");
  const [cardHolder, setCardHolder] = useState("");
  const [cardLastFour, setCardLastFour] = useState("");
  const [method, setMethod] = useState<"credit_card" | "debit_card">(
    "credit_card"
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!flight) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!flight) return;
    setError(null);
    setIsSubmitting(true);

    const input: CreateBookingInput = {
      flightId: flight.id,
      passengerName,
      passengerEmail,
      paymentDetails: {
        cardLastFour,
        cardHolder,
        method,
      },
    };

    try {
      await createBooking(input);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Buchung fehlgeschlagen");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Flug buchen"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Schliessen">
          ×
        </button>

        <h2 className={styles.title}>Flug buchen</h2>

        {/* Flight summary */}
        <div className={styles.flightSummary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Flug</span>
            <span>
              {flight.airline} {flight.flightNumber}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Route</span>
            <span>
              {flight.origin} → {flight.destination}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Abflug</span>
            <span>
              {new Date(flight.departureTime).toLocaleString("de-CH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Preis</span>
            <strong className={styles.price}>
              CHF {parseFloat(flight.price).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Step indicator */}
        <div className={styles.steps}>
          {(["passenger", "payment", "confirm"] as const).map((s, i) => (
            <span
              key={s}
              className={`${styles.step} ${step === s ? styles.stepActive : ""} ${
                ["passenger", "payment", "confirm"].indexOf(step) > i
                  ? styles.stepDone
                  : ""
              }`}
            >
              {i + 1}. {s === "passenger" ? "Passagier" : s === "payment" ? "Zahlung" : "Bestätigen"}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {step === "passenger" && (
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="pName" className={styles.label}>
                  Name des Passagiers
                </label>
                <input
                  id="pName"
                  type="text"
                  className={styles.input}
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="pEmail" className={styles.label}>
                  E-Mail des Passagiers
                </label>
                <input
                  id="pEmail"
                  type="email"
                  className={styles.input}
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.footerActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onClose}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={() => setStep("payment")}
                  disabled={!passengerName || !passengerEmail}
                >
                  Weiter →
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="cardHolder" className={styles.label}>
                  Karteninhaber
                </label>
                <input
                  id="cardHolder"
                  type="text"
                  className={styles.input}
                  placeholder="Max Muster"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="cardLastFour" className={styles.label}>
                  Letzte 4 Ziffern der Karte
                </label>
                <input
                  id="cardLastFour"
                  type="text"
                  className={styles.input}
                  placeholder="1234"
                  value={cardLastFour}
                  maxLength={4}
                  pattern="\d{4}"
                  onChange={(e) =>
                    setCardLastFour(e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="method" className={styles.label}>
                  Zahlungsmethode
                </label>
                <select
                  id="method"
                  className={styles.input}
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value as typeof method)
                  }
                >
                  <option value="credit_card">Kreditkarte</option>
                  <option value="debit_card">Debitkarte</option>
                </select>
              </div>
              <div className={styles.footerActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setStep("passenger")}
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={() => setStep("confirm")}
                  disabled={!cardHolder || cardLastFour.length !== 4}
                >
                  Weiter →
                </button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className={styles.fieldGroup}>
              <div className={styles.confirmSummary}>
                <p>
                  <strong>Passagier:</strong> {passengerName} ({passengerEmail})
                </p>
                <p>
                  <strong>Karte:</strong> **** **** **** {cardLastFour} (
                  {method === "credit_card" ? "Kreditkarte" : "Debitkarte"})
                </p>
                <p className={styles.totalLine}>
                  <strong>Gesamtbetrag:</strong>{" "}
                  <strong className={styles.price}>
                    CHF {parseFloat(flight.price).toFixed(2)}
                  </strong>
                </p>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.footerActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setStep("payment")}
                >
                  ← Zurück
                </button>
                <button
                  type="submit"
                  className={styles.confirmBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Buche…" : "Jetzt buchen ✓"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
