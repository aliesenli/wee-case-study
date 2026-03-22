import styles from "./Pagination.module.scss";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onPage }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page buttons
  const visiblePages =
    totalPages <= 5
      ? pages
      : [
          1,
          ...(page > 3 ? ["…"] : []),
          ...pages.slice(Math.max(1, page - 2), Math.min(totalPages - 1, page + 2)),
          ...(page < totalPages - 2 ? ["…"] : []),
          totalPages,
        ];

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>{total} Ergebnisse</span>
      <div className={styles.buttons}>
        <button
          className={styles.btn}
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
        >
          ‹
        </button>

        {visiblePages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.btn} ${p === page ? styles.active : ""}`}
              onClick={() => onPage(p as number)}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.btn}
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
