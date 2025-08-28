"use client";
import React, { useMemo } from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  maxPagesToShow = 5,        // window size (odd number preferred)
}) {
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  const pages = useMemo(() => {
    const items = [];
    if (totalPages <= 0) return items;

    const windowSize = Math.max(3, maxPagesToShow | 0); // at least 3
    const half = Math.floor(windowSize / 2);

    let start = clamp(currentPage - half, 1, Math.max(1, totalPages - windowSize + 1));
    let end = Math.min(totalPages, start + windowSize - 1);

    // Shift window if near the end
    if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

    // Leading first/ellipsis
    if (start > 1) {
      items.push(1);
      if (start > 2) items.push("…l");
    }

    for (let p = start; p <= end; p++) items.push(p);

    // Trailing ellipsis/last
    if (end < totalPages) {
      if (end < totalPages - 1) items.push("…r");
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages, maxPagesToShow]);

  const go = (p) => {
    if (p === "…l" || p === "…r") return;
    const next = clamp(p, 1, totalPages);
    if (next !== currentPage) onPageChange(next);
  };

  return (
    <ul className="page_navigation mt20" role="navigation" aria-label="Pagination">
      {/* Prev */}
      <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          aria-label="Previous page"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage <= 1}
          type="button"
        >
          <span className="fas fa-angle-left" />
        </button>
      </li>

      {/* Numbers + ellipses */}
      {pages.map((p, i) =>
        typeof p === "number" ? (
          <li
            key={p}
            className={`page-item ${p === currentPage ? "active" : ""}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            <button className="page-link" onClick={() => go(p)} type="button">
              {p}
            </button>
          </li>
        ) : (
          <li key={`${p}-${i}`} className="page-item disabled" aria-hidden="true">
            <span className="page-link" style={{ pointerEvents: "none" }}>…</span>
          </li>
        )
      )}

      {/* Next */}
      <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          aria-label="Next page"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage >= totalPages}
          type="button"
        >
          <span className="fas fa-angle-right" />
        </button>
      </li>
    </ul>
  );
}
