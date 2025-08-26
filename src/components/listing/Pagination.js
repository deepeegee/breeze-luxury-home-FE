"use client";
import React, { useState, useEffect } from "react";

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5;

  // Handle page clicks
  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page); // Notify parent
  };

  // Generate page numbers dynamically
  const generatePageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mbp_pagination text-center">
      <ul className="page_navigation">
        {/* Previous button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <span
            className="page-link pointer"
            onClick={() => handlePageClick(currentPage - 1)}
          >
            <span className="fas fa-angle-left" />
          </span>
        </li>

        {/* Dynamic page numbers */}
        {generatePageNumbers().map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <span
              className="page-link pointer"
              onClick={() => handlePageClick(page)}
            >
              {page}
            </span>
          </li>
        ))}

        {/* Next button */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <span
            className="page-link pointer"
            onClick={() => handlePageClick(currentPage + 1)}
          >
            <span className="fas fa-angle-right" />
          </span>
        </li>
      </ul>

      {/* Page info */}
      <p className="mt10 pagination_page_count text-center">
        {`${(currentPage - 1) * itemsPerPage + 1} -
          Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} properties`}
      </p>
    </div>
  );
};

export default Pagination;
