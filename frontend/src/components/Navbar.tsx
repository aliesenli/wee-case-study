import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span>WEE Flugbuchung</span>
        </Link>

        {!isLoading && (
          <div className={styles.actions}>
            {user ? (
              <>
                <Link to="/" className={styles.navLink}>
                  Flüge suchen
                </Link>
                <Link to="/bookings" className={styles.navLink}>
                  Meine Buchungen
                </Link>
                <span className={styles.userBadge}>{user.name}</span>
                <button
                  onClick={handleSignOut}
                  className={styles.signOutBtn}
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>
                  Anmelden
                </Link>
                <Link to="/register" className={styles.registerBtn}>
                  Registrieren
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
