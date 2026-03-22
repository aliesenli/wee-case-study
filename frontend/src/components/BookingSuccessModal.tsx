import { Link } from "react-router-dom";
import styles from "./BookingSuccessModal.module.scss";

interface Props {
  onClose: () => void;
}

export function BookingSuccessModal({ onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.icon}>✓</div>
        <h2 className={styles.title}>Buchung erfolgreich!</h2>
        <p className={styles.text}>
          Ihre Buchung wurde bestätigt und wird in Ihrer Buchungshistorie
          gespeichert.
        </p>
        <div className={styles.actions}>
          <button className={styles.closeBtn} onClick={onClose}>
            Weitere Flüge suchen
          </button>
          <Link to="/bookings" className={styles.historyBtn}>
            Meine Buchungen ansehen
          </Link>
        </div>
      </div>
    </div>
  );
}
