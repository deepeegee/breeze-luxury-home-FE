"use client";
import React, { useMemo } from "react";

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange = () => {},
  maxPagesToShow = 5,
  showCountText = true,
  itemLabel = "properties",
}) => {
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  const totalPages = useMemo(() => {
    if (!itemsPerPage || itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil((totalItems || 0) / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const pages = useMemo(() => {
    const pageNumbers = [];
    const windowSize = Math.max(3, maxPagesToShow | 0);
    const half = Math.floor(windowSize / 2);

    let startPage = clamp(
      currentPage - half,
      1,
      Math.max(1, totalPages - windowSize + 1)
    );
    let endPage = Math.min(totalPages, startPage + windowSize - 1);

    // Leading first + ellipsis
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("…l");
    }

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    // Trailing ellipsis + last
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("…r");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }, [currentPage, totalPages, maxPagesToShow]);

  const handlePageClick = (page) => {
    if (page === "…l" || page === "…r") return;
    const next = clamp(page, 1, totalPages);
    if (next !== currentPage) onPageChange(next);
  };

  const countText = useMemo(() => {
    if (!showCountText) return "";
    if (totalItems <= 0) return `0 of 0 ${itemLabel}`;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(totalItems, start + itemsPerPage - 1);
    return `${start}-${end} of ${totalItems} ${itemLabel}`;
  }, [showCountText, totalItems, itemsPerPage, currentPage, itemLabel]);

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation" role="navigation" aria-label="Pagination">
        <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
          <button
            className="page-link pointer"
            type="button"
            aria-label="Previous page"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="fas fa-angle-left" />
          </button>
        </li>

        {pages.map((p, idx) =>
          typeof p === "number" ? (
            <li
              key={p}
              className={`page-item${p === currentPage ? " active" : ""}`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              <button
                className="page-link pointer"
                type="button"
                onClick={() => handlePageClick(p)}
              >
                {p}
              </button>
            </li>
          ) : (
            <li key={`${p}-${idx}`} className="page-item disabled" aria-hidden="true">
              <span className="page-link" style={{ pointerEvents: "none" }}>…</span>
            </li>
          )
        )}

        <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
          <button
            className="page-link pointer"
            type="button"
            aria-label="Next page"
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="fas fa-angle-right" />
          </button>
        </li>
      </ul>

      {showCountText && (
        <p className="mt10 pagination_page_count text-center">
          {countText}
        </p>
      )}
    </div>
  );
};

export default Pagination;
