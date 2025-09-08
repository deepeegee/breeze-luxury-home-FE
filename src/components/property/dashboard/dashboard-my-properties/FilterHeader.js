'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Props (all optional):
 * - search, onSearchChange
 * - availability ("All" | "For sale" | "Sold"), onAvailabilityChange
 * - sort, onSortChange (if you expose sorting)
 */
export default function PropertyDashboardFilter({
  search: searchProp,
  onSearchChange,
  availability = 'All',
  onAvailabilityChange,
  sort,
  onSortChange,
}) {
  const router = useRouter();

  const [searchLocal, setSearchLocal] = useState(searchProp ?? '');
  useEffect(() => {
    if (searchProp !== undefined) setSearchLocal(searchProp);
  }, [searchProp]);

  const isControlledSearch = searchProp !== undefined;
  const search = isControlledSearch ? searchProp : searchLocal;

  const handleSearch = (v) => {
    if (!isControlledSearch) setSearchLocal(v);
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
            placeholder="Search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <label><span className="flaticon-search" /></label>
        </div>
      </div>

      {/* Availability */}
      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw180">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '88px' }} className="title-color">Availability:</span>
          <select
            className="form-select show-tick"
            value={availability}
            onChange={(e) => onAvailabilityChange?.(e.target.value)}
          >
            <option value="All">All</option>
            <option value="For sale">For sale</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Sort (optional) */}
      {/* <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: '50px' }} className="title-color">Sort by:</span>
          <select
            className="form-select show-tick"
            value={sort}
            onChange={(e) => onSortChange?.(e.target.value)}
          >
            <option value="Best Seller">Best Seller</option>
            <option value="Best Match">Best Match</option>
            <option value="Price Low">Price Low</option>
            <option value="Price High">Price High</option>
          </select>
        </div>
      </div> */}

      <button
        type="button"
        className="ud-btn btn-thm"
        onClick={() => router.push('/dashboard-add-property')}
      >
        Add New Property <i className="fal fa-arrow-right-long" />
      </button>
    </div>
  );
}
