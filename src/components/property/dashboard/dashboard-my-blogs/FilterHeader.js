// components/blogs/BlogDashboardFilter.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Props (all optional):
 * - search, onSearchChange
 * - status ("All" | "Published" | "Draft"), onStatusChange
 * - sort ("Newest" | "Oldest" | "A–Z"), onSortChange
 */
export default function BlogDashboardFilter({
  search: searchProp,
  onSearchChange,
  status: statusProp = 'All',
  onStatusChange,
  sort: sortProp = 'Newest',
  onSortChange,
}) {
  const router = useRouter();

  // If parent controls "search", mirror it; otherwise keep local
  const [searchLocal, setSearchLocal] = useState(searchProp ?? '');
  useEffect(() => {
    if (searchProp !== undefined) setSearchLocal(searchProp);
  }, [searchProp]);

  const isControlledSearch = searchProp !== undefined;
  const search = isControlledSearch ? searchProp : searchLocal;

  const handleSearch = (v) => {
    if (isControlledSearch) onSearchChange?.(v);
    else setSearchLocal(v);
    onSearchChange?.(v);
  };

  return (
    <div className="dashboard_search_meta d-md-flex align-items-center justify-content-xxl-end">
      {/* Search */}
      <div className="item1 mb15-sm">
        <div className="search_area">
          <input
            type="text"
            className="form-control bdrs12"
            placeholder="Search title or tags"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <label><span className="flaticon-search" /></label>
        </div>
      </div>

      {/* Status */}
      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '56px' }} className="title-color">Status:</span>
          <select
            className="form-select show-tick"
            value={statusProp}
            onChange={(e) => onStatusChange?.(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Sort (uncomment if you want visible) */}
      {/* <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '50px' }} className="title-color">Sort:</span>
          <select
            className="form-select show-tick"
            value={sortProp}
            onChange={(e) => onSortChange?.(e.target.value)}
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>A–Z</option>
          </select>
        </div>
      </div> */}

      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={() => router.push('/dashboard-add-blog')}
      >
        Add New Post <i className="fal fa-arrow-right-long" />
      </button>
    </div>
  );
}
