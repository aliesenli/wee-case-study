import { useState, type FormEvent } from "react";
import type { FlightFilters } from "@/types";
import styles from "./SearchForm.module.scss";

interface Props {
  initialFilters?: FlightFilters;
  onSearch: (filters: FlightFilters) => void;
  isLoading?: boolean;
}

export function SearchForm({ initialFilters = {}, onSearch, isLoading }: Props) {
  const [filters, setFilters] = useState<FlightFilters>(initialFilters);

  function set<K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch({ ...filters, page: 1 });
  }

  function handleReset() {
    setFilters({});
    onSearch({});
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="origin" className={styles.label}>
            Abreiseort
          </label>
          <input
            id="origin"
            type="text"
            className={styles.input}
            placeholder="z.B. Zürich"
            value={filters.origin ?? ""}
            onChange={(e) => set("origin", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="destination" className={styles.label}>
            Zielort
          </label>
          <input
            id="destination"
            type="text"
            className={styles.input}
            placeholder="z.B. London"
            value={filters.destination ?? ""}
            onChange={(e) => set("destination", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="date" className={styles.label}>
            Datum
          </label>
          <input
            id="date"
            type="date"
            className={styles.input}
            value={filters.date ?? ""}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="airline" className={styles.label}>
            Fluggesellschaft
          </label>
          <input
            id="airline"
            type="text"
            className={styles.input}
            placeholder="z.B. SWISS"
            value={filters.airline ?? ""}
            onChange={(e) => set("airline", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="minPrice" className={styles.label}>
            Min. Preis (CHF)
          </label>
          <input
            id="minPrice"
            type="number"
            className={styles.input}
            placeholder="0"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              set("minPrice", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="maxPrice" className={styles.label}>
            Max. Preis (CHF)
          </label>
          <input
            id="maxPrice"
            type="number"
            className={styles.input}
            placeholder="9999"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              set("maxPrice", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="sortBy" className={styles.label}>
            Sortierung
          </label>
          <select
            id="sortBy"
            className={styles.input}
            value={filters.sortBy ?? "departure_asc"}
            onChange={(e) =>
              set("sortBy", e.target.value as FlightFilters["sortBy"])
            }
          >
            <option value="departure_asc">Abflug (früh → spät)</option>
            <option value="departure_desc">Abflug (spät → früh)</option>
            <option value="price_asc">Preis (günstig → teuer)</option>
            <option value="price_desc">Preis (teuer → günstig)</option>
          </select>
        </div>

        <div className={`${styles.field} ${styles.checkboxField}`}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.availableOnly ?? false}
              onChange={(e) => set("availableOnly", e.target.checked)}
            />
            Nur verfügbare Flüge
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Zurücksetzen
        </button>
        <button type="submit" className={styles.searchBtn} disabled={isLoading}>
          {isLoading ? "Suche läuft…" : "Suchen"}
        </button>
      </div>
    </form>
  );
}
