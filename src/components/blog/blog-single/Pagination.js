"use client";
import React from "react";

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Props:
 *  - currentPage: number (1-based)
 *  - totalPages: number
 *  - onPageChange: (page: number) => void
 */
const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange = () => {} }) => {
  if (totalPages <= 1) return null;

  // compact number list with ellipses (1 … N-1 N)
  const pages = [];
  const push = (x) => pages.push(x);

  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  push(1);
  if (left > 2) push("…");
  range(left, right).forEach(push);
  if (right < totalPages - 1) push("…");
  if (totalPages > 1) push(totalPages);

  const goto = (p) => {
    if (typeof p !== "number") return;
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <nav className="d-flex justify-content-center mt30">
      <ul className="pagination">
        <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => goto(currentPage - 1)} aria-label="Previous">
            &laquo;
          </button>
        </li>

        {pages.map((p, i) =>
          p === "…" ? (
            <li key={`el-${i}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
              <button className="page-link" onClick={() => goto(p)}>{p}</button>
            </li>
          )
        )}

        <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => goto(currentPage + 1)} aria-label="Next">
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
